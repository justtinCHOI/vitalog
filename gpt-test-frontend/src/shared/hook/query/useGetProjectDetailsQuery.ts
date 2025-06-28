import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';

interface Summary {
    id: number;
    content: string;
    createdAt: string;
}

export interface ProjectDetails {
    id: number;
    name: string;
    summaries: Summary[];
}

const getProjectDetails = async (projectId: string): Promise<ProjectDetails> => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};

export const useGetProjectDetailsQuery = (projectId: string) => {
    return useQuery({
        queryKey: ['projectDetails', projectId],
        queryFn: () => getProjectDetails(projectId),
        enabled: !!projectId, // Only run if projectId is available
    });
}; 