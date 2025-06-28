import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';

interface Project {
    id: number;
    name: string;
    createdAt: string;
}

const getProjects = async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
};

export const useGetProjectsQuery = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    });
}; 