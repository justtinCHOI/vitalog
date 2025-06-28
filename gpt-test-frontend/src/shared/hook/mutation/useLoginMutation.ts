import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/shared/api/jwtAxios';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useToast } from '@/shared/UI/toast/use-toast';
import { loginSchema } from '@/shared/schemas/auth';
import { z } from 'zod';

export const useLoginMutation = () => {
    const { login } = useAuthStore();
    const router = useRouter();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: z.infer<typeof loginSchema>) => {
            const response = await api.post('/auth/login', data);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.accessToken) {
                login(data.accessToken);
                toast({
                    title: 'Login Successful',
                    description: 'Welcome back!',
                });
                router.push('/');
            }
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error?.response?.data?.message || 'Please check your credentials and try again.',
            });
        },
    });
}; 