import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';
import { useToast } from '@/shared/UI/toast/use-toast';

const uploadChats = async ({ projectId, file }: { projectId: string; file: File }) => {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post(`/projects/${projectId}/chats/import`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const useUploadChatsMutation = (projectId: string) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (file: File) => uploadChats({ projectId, file }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats', projectId] });
            toast({
                title: 'Upload Successful',
                description: 'Your chat file has been uploaded and processed.',
            });
        },
        onError: () => {
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'There was an error uploading your file. Please try again.',
            });
        },
    });
}; 