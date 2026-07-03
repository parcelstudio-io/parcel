-- Personal Agent App initial schema

create extension if not exists "uuid-ossp";

create type post_type as enum ('photo', 'video', 'writing');

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  agent_persona jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Personal agents
create table public.agents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  llm_provider text default 'ollama',
  llm_model text default 'gemma4',
  system_instruction_override text,
  developer_instruction_override text,
  memory jsonb default '{"facts":[],"preferences":{}}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Agent-to-agent threads (feed)
create table public.agent_threads (
  id uuid primary key default uuid_generate_v4(),
  user_a_id uuid not null references public.profiles(id) on delete cascade,
  user_b_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default '',
  summary text not null default '',
  created_at timestamptz default now() not null,
  check (user_a_id <> user_b_id)
);

create table public.agent_messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references public.agent_threads(id) on delete cascade,
  agent_user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'agent',
  content text not null,
  sequence int not null,
  created_at timestamptz default now() not null,
  unique (thread_id, sequence)
);

create table public.thread_comments (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references public.agent_threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now() not null
);

-- Home posts (Pinterest-style)
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type post_type not null,
  caption text,
  media_url text,
  body text,
  created_at timestamptz default now() not null
);

create table public.post_likes (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique (post_id, user_id)
);

create table public.post_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now() not null
);

-- Direct messaging
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.conversation_participants (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz default now() not null,
  unique (conversation_id, user_id)
);

create table public.direct_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now() not null
);

-- Personal agent chat history
create table public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_agent_threads_created on public.agent_threads(created_at desc);
create index idx_agent_messages_thread on public.agent_messages(thread_id, sequence);
create index idx_posts_author on public.posts(author_id, created_at desc);
create index idx_direct_messages_conversation on public.direct_messages(conversation_id, created_at);
create index idx_chat_messages_user on public.chat_messages(user_id, created_at);

-- Auto-create profile + agent on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  insert into public.agents (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.agent_threads enable row level security;
alter table public.agent_messages enable row level security;
alter table public.thread_comments enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.direct_messages enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles: public read, own write
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Agents: owner only
create policy "Users can view own agent" on public.agents for select using (auth.uid() = user_id);
create policy "Users can update own agent" on public.agents for update using (auth.uid() = user_id);

-- Agent threads: public read
create policy "Threads are viewable by everyone" on public.agent_threads for select using (true);
create policy "Authenticated can create threads" on public.agent_threads for insert with check (auth.uid() is not null);

-- Agent messages: public read
create policy "Agent messages are viewable by everyone" on public.agent_messages for select using (true);
create policy "Authenticated can create agent messages" on public.agent_messages for insert with check (auth.uid() is not null);

-- Thread comments: participants only
create policy "Thread comments viewable by everyone" on public.thread_comments for select using (true);
create policy "Participants can comment" on public.thread_comments for insert with check (
  auth.uid() = author_id and
  exists (
    select 1 from public.agent_threads t
    where t.id = thread_id and (t.user_a_id = auth.uid() or t.user_b_id = auth.uid())
  )
);

-- Posts: public read, own write
create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Users can create own posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "Users can update own posts" on public.posts for update using (auth.uid() = author_id);
create policy "Users can delete own posts" on public.posts for delete using (auth.uid() = author_id);

-- Post likes
create policy "Likes viewable by everyone" on public.post_likes for select using (true);
create policy "Users can like posts" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike posts" on public.post_likes for delete using (auth.uid() = user_id);

-- Post comments
create policy "Post comments viewable by everyone" on public.post_comments for select using (true);
create policy "Users can comment on posts" on public.post_comments for insert with check (auth.uid() = author_id);

-- Conversations: participants only
create policy "Participants can view conversations" on public.conversations for select using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = id and cp.user_id = auth.uid()
  )
);
create policy "Authenticated can create conversations" on public.conversations for insert with check (auth.uid() is not null);

create policy "Participants viewable by members" on public.conversation_participants for select using (
  user_id = auth.uid() or exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversation_id and cp.user_id = auth.uid()
  )
);
create policy "Authenticated can add participants" on public.conversation_participants for insert with check (auth.uid() is not null);

-- Direct messages: participants only
create policy "Participants can view messages" on public.direct_messages for select using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversation_id and cp.user_id = auth.uid()
  )
);
create policy "Participants can send messages" on public.direct_messages for insert with check (
  auth.uid() = sender_id and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversation_id and cp.user_id = auth.uid()
  )
);

-- Chat messages: owner only
create policy "Users can view own chat messages" on public.chat_messages for select using (auth.uid() = user_id);
create policy "Users can create own chat messages" on public.chat_messages for insert with check (auth.uid() = user_id);

-- Storage bucket for media (run in Supabase dashboard or via API)
-- insert into storage.buckets (id, name, public) values ('media', 'media', true);

-- Realtime for direct messages
alter publication supabase_realtime add table public.direct_messages;
