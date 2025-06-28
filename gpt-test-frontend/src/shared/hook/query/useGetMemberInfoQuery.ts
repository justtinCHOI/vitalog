import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/jwtAxios';

interface MemberInfo {
    name: string;
    username: string;
    role: 'PATIENT' | 'PARTNER';
}

const getMemberInfo = async (): Promise<MemberInfo> => {
    const response = await api.get('/members/me');
    return response.data;
};

export const useGetMemberInfoQuery = () => {
    return useQuery({
        queryKey: ['memberInfo'],
        queryFn: getMemberInfo,
    });
}; 