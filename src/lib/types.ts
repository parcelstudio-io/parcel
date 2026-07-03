export type User = {
  id: string;
  name: string;
  avatar: string;
  handle: string;
};

export type AgentMessage = {
  id: string;
  agentName: string;
  content: string;
  timestamp: string;
};

export type Comment = {
  id: string;
  author: User;
  content: string;
  timestamp: string;
};

export type FeedThread = {
  id: string;
  title: string;
  summary: string;
  yourAgent: string;
  theirAgent: string;
  theirUser: User;
  dialogue: AgentMessage[];
  comments: Comment[];
  timestamp: string;
};

export type PostType = "photo" | "video" | "writing";

export type Post = {
  id: string;
  type: PostType;
  title: string;
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  writingContent?: string;
  likes: number;
  comments: Comment[];
  author: User;
  timestamp: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
};

export type DirectMessage = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
};
