import { useMutation } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';
import { useToast } from '@/shared/UI/toast/use-toast';
import { z } from 'zod';

export const registerPatientSchema = z.object({
    invitationCode: z.string().min(1, { message: 'Invitation code is required.' }),
});

const registerPatient = async (data: z.infer<typeof registerPatientSchema>) => {
    return await api.post('/members/me/register-patient', data);
};

export const useRegisterPatientMutation = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: registerPatient,
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Patient registered successfully!',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error?.response?.data?.message || 'Failed to register patient. Check the code and try again.',
            });
        },
    });
}; 