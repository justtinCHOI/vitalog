import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';

export interface Chat {
    id: number;
    name: string;
    message: string;
    date: string;
}

const getChats = async (projectId: string): Promise<Chat[]> => {
    const response = await api.get(`/projects/${projectId}/chats`);
    return response.data;
};

export const useGetChatsQuery = (projectId: string) => {
    return useQuery({
        queryKey: ['chats', projectId],
        queryFn: () => getChats(projectId),
        enabled: !!projectId,
    });
}; 