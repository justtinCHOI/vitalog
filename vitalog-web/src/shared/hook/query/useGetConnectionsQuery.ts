import { useQuery } from '@tanstack/react-query';

import jwtAxios from '@/shared/api/jwtAxios';
import type { Member } from '@/types/member.type';

const getConnections = async (): Promise<Member[]> => {
    const { data } = await jwtAxios.get('/members/me/connections');
    return data;
};

export const useGetConnectionsQuery = () => {
    return useQuery<Member[], Error>({
        queryKey: ['connections'],
        queryFn: getConnections,
    });
}; 