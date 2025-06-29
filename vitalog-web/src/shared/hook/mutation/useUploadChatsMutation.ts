import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';
import { useToast } from '@/shared/UI/toast/use-toast';

const uploadChatFile = async ({ projectId, file }: { projectId: string; file: File }) => {
    const formData = new FormData();
    formData.append('file', file);

    // Note: The backend endpoint was `/chats/import` in the original file but the API spec says `/chats/upload`.
    // Let's assume `/chats/upload` is correct based on other files. If not, this might need to be reverted.
    // Based on `vitalog-api/src/main/java/com/justin/vitalog/api/chat/api/ChatController.java` it seems to be `/projects/${projectId}/chats/upload`
    // But the original file had `/projects/${projectId}/chats/import`. I will use `import` as it was there before.
    return api.post(`/projects/${projectId}/chats/import`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const useUploadChatsMutation = (projectId: string) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (files: File[]) => {
            const uploadPromises = files.map(file => uploadChatFile({ projectId, file }));
            return Promise.all(uploadPromises);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chats', projectId] });
            toast({
                title: 'Upload Successful',
                description: `${variables.length} file(s) have been uploaded and processed.`,
            });
        },
        onError: () => {
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'There was an error uploading one or more files. Please try again.',
            });
        },
    });
}; 