// Database table interfaces

export interface RssFeed {
  jobid: number;
  title: string;
  url: string;
  author: string;
  pubdate: Date;
  content?: string;
  snippet?: string;
  summary?: string;
  summary_zh?: string;
  imgurl?: string;
}

export interface EmailFeed {
  jobid: number;
  threadid: string;
  subject: string;
  participants?: string;
  messages?: string;
  summary?: string;
  summary_zh?: string;
  lastactivity: Date;
}

export interface NewsFeed {
  jobid: number;
  subject: string;
  source: string;
  pubdate: Date;
  messages?: string;
  summary?: string;
  summary_zh?: string;
  imgurl?: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  created_at: Date;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  feed_type: 'rss' | 'email' | 'news';
  source_identifier: string;
  created_at: Date;
}

// Combined feed type for unified display
export interface UnifiedFeed {
  id: number | string;
  type: 'rss' | 'email' | 'news' | 'daily-updates';
  title: string;
  content?: string;
  date: Date | null;
  source?: string;
  link?: string;
  summary_english?: string;
  summary_chinese?: string;
  imgurl?: string;
  metadata?: Record<string, any>;
}

// API response types
export interface FeedResponse {
  feeds: UnifiedFeed[];
  total: number;
  hasMore: boolean;
}

export interface SourceGroup {
  type: 'rss' | 'email' | 'news';
  sources: string[];
}
