export type PostType = "photo" | "video" | "writing";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  agent_persona: Record<string, unknown> | null;
  created_at: string;
}

export interface Agent {
  id: string;
  user_id: string;
  llm_provider: string | null;
  llm_model: string | null;
  system_instruction_override: string | null;
  developer_instruction_override: string | null;
  memory: AgentMemory;
  created_at: string;
  updated_at: string;
}

export interface AgentMemory {
  facts: string[];
  preferences: Record<string, string>;
  last_updated?: string;
}

export interface AgentThread {
  id: string;
  user_a_id: string;
  user_b_id: string;
  title: string;
  summary: string;
  created_at: string;
  user_a?: Profile;
  user_b?: Profile;
}

export interface AgentMessage {
  id: string;
  thread_id: string;
  agent_user_id: string;
  role: "agent" | "system";
  content: string;
  sequence: number;
  created_at: string;
  profile?: Profile;
}

export interface ThreadComment {
  id: string;
  thread_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface Post {
  id: string;
  author_id: string;
  type: PostType;
  caption: string | null;
  media_url: string | null;
  body: string | null;
  created_at: string;
  author?: Profile;
  like_count?: number;
  comment_count?: number;
  liked_by_user?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  other_user?: Profile;
  last_message?: DirectMessage;
  unread_count?: number;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  sender?: Profile;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface VoiceSegment {
  speaker: number;
  text: string;
  audio_base64?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; username: string }; Update: Partial<Profile>; Relationships: [] };
      agents: { Row: Agent; Insert: Partial<Agent> & { user_id: string }; Update: Partial<Agent>; Relationships: [] };
      agent_threads: { Row: AgentThread; Insert: Partial<AgentThread> & { user_a_id: string; user_b_id: string }; Update: Partial<AgentThread>; Relationships: [] };
      agent_messages: { Row: AgentMessage; Insert: Partial<AgentMessage> & { thread_id: string; agent_user_id: string; content: string; sequence: number }; Update: Partial<AgentMessage>; Relationships: [] };
      thread_comments: { Row: ThreadComment; Insert: Partial<ThreadComment> & { thread_id: string; author_id: string; content: string }; Update: Partial<ThreadComment>; Relationships: [] };
      posts: { Row: Post; Insert: Partial<Post> & { author_id: string; type: PostType }; Update: Partial<Post>; Relationships: [] };
      post_comments: { Row: PostComment; Insert: Partial<PostComment> & { post_id: string; author_id: string; content: string }; Update: Partial<PostComment>; Relationships: [] };
      post_likes: { Row: { id: string; post_id: string; user_id: string; created_at: string }; Insert: { post_id: string; user_id: string }; Update: Partial<{ id: string }>; Relationships: [] };
      conversations: { Row: { id: string; created_at: string; updated_at: string }; Insert: Record<string, never>; Update: Partial<{ updated_at: string }>; Relationships: [] };
      conversation_participants: { Row: { id: string; conversation_id: string; user_id: string; joined_at: string }; Insert: { conversation_id: string; user_id: string }; Update: Partial<{ id: string }>; Relationships: [] };
      direct_messages: { Row: DirectMessage; Insert: Partial<DirectMessage> & { conversation_id: string; sender_id: string; content: string }; Update: Partial<DirectMessage>; Relationships: [] };
      chat_messages: { Row: { id: string; user_id: string; role: string; content: string; created_at: string }; Insert: { user_id: string; role: string; content: string }; Update: Partial<{ id: string }>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      post_type: PostType;
    };
    CompositeTypes: Record<string, never>;
  };
}
