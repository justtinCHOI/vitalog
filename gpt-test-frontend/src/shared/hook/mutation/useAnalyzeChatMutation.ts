import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';
import { useToast } from '@/shared/UI/toast/use-toast';

interface AnalysisResponse {
    summary: string;
}

const analyzeChat = async (projectId: string): Promise<AnalysisResponse> => {
    const response = await api.post(`/chats/analyze/${projectId}`);
    return response.data;
};

export const useAnalyzeChatMutation = (projectId: string) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: () => analyzeChat(projectId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] });
            toast({
                title: 'Analysis Complete',
                description: 'The chat analysis has been successfully completed.',
            });
            return data;
        },
        onError: () => {
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'An error occurred during chat analysis.',
            });
        },
    });
};
