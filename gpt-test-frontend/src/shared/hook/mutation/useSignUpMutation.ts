import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/shared/api/jwtAxios';
import { useToast } from '@/shared/UI/toast/use-toast';
import { signUpSchema } from '@/shared/schemas/auth';
import { z } from 'zod';

export const useSignUpMutation = () => {
    const router = useRouter();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: z.infer<typeof signUpSchema>) => {
            return await api.post('/auth/signup', data);
        },
        onSuccess: () => {
            toast({
                title: 'Sign Up Successful',
                description: 'You can now log in with your new account.',
            });
            router.push('/login');
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Sign Up Failed',
                description: error?.response?.data?.message || 'An unexpected error occurred. Please try again.',
            });
        },
    });
}; 