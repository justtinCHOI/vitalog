import { useMutation, useQueryClient } from '@tanstack/react-query';

import jwtAxios from '@/shared/api/jwtAxios';
import { useToast } from '@/shared/UI/toast/use-toast';

interface UpdateProjectPayload {
    projectId: string;
    name: string;
}

const updateProject = async ({ projectId, name }: UpdateProjectPayload) => {
    const { data } = await jwtAxios.patch(`/projects/${projectId}`, { name });
    return data;
};

export const useUpdateProjectMutation = (projectId: string) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (name: string) => updateProject({ projectId, name }),
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Project name updated successfully.',
            });
            queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to update project name.',
                variant: 'destructive',
            });
        },
    });
}; 