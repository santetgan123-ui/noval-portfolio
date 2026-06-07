export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string;
  live_url?: string;
  github_url?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}
