import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  verified: boolean;
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  type: 'text' | 'image' | 'video';
  media_url?: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  is_private: boolean;
  cover_image?: string;
  location?: string;
  member_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location_name: string;
  location_address: string;
  location_city: string;
  organizer_name: string;
  organizer_contact?: string;
  capacity: number;
  attendees_count: number;
  price: number;
  is_online: boolean;
  image_url?: string;
  tags: string[];
  requirements?: string[];
  created_at: string;
  updated_at: string;
}

export interface DuaRequest {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_urgent: boolean;
  is_anonymous: boolean;
  tags: string[];
  prayers_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}