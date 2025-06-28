import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';
import { useToast } from '@/shared/UI/toast/use-toast';
import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string().min(1, { message: 'Project name is required.' }),
});

const createProject = async (data: z.infer<typeof createProjectSchema>) => {
    return await api.post('/projects', data);
};

export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast({
                title: 'Success',
                description: 'New project created successfully.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error?.response?.data?.message || 'Failed to create project.',
            });
        },
    });
}; 