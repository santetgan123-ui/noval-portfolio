import { createClient } from '@/lib/supabase/server';
import { Project } from '@/types';
import ProjectsClient from './ProjectsClient';

async function fetchProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return (data as Project[]) ?? [];
  } catch {
    return [];
  }
}

export default async function Projects({ limit }: { limit?: number }) {
  const projects = await fetchProjects();
  return <ProjectsClient projects={projects} limit={limit} />;
}
