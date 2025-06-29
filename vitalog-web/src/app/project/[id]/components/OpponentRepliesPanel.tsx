'use client';

import { Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/UI/card';

const mockReplies = [
    { id: 1, text: '상대의 첫 번째 예상 답변입니다.' },
    { id: 2, text: '상대의 두 번째 예상 답변입니다. 이것도 조금 더 깁니다.' },
    { id: 3, text: '상대의 세 번째 예상 답변입니다.' },
];

export function OpponentRepliesPanel() {
    // In a real implementation, you would use a query hook like this:
    // const { data: replies, isLoading } = useGetOpponentRepliesQuery(projectId);

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-400" />
                    상대의 예상 답변
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {mockReplies.map((reply) => (
                    <div key={reply.id} className="cursor-pointer rounded-lg bg-muted p-3 transition-all hover:bg-muted/80">
                        <p className="text-sm">{reply.text}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
} 