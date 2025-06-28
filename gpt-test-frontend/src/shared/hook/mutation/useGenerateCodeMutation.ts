import { useMutation } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';
import { useToast } from '@/shared/UI/toast/use-toast';
import { useState } from 'react';

const generateCode = async (): Promise<{ invitationCode: string }> => {
    // The original code had `/api/members/me/invitation-code`, but this seems more correct
    const response = await api.post('/members/me/invitation-code');
    return response.data;
};

export const useGenerateCodeMutation = () => {
    const { toast } = useToast();
    const [invitationCode, setInvitationCode] = useState('');

    const mutation = useMutation({
        mutationFn: generateCode,
        onSuccess: (data) => {
            setInvitationCode(data.invitationCode);
            toast({
                title: 'Code Generated Successfully',
                description: `Your new invitation code is: ${data.invitationCode}`,
            });
        },
        onError: () => {
            toast({
                variant: 'destructive',
                title: 'Error Generating Code',
                description: 'Failed to generate a new invitation code. Please try again.',
            });
        },
    });

    return { ...mutation, invitationCode };
}; 