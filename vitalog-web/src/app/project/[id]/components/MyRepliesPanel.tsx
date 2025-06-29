'use client';

import { Lightbulb } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/UI/card';

const mockReplies = [
    { id: 1, text: '첫 번째 추천 답변입니다.', priority: true },
    { id: 2, text: '두 번째 추천 답변입니다. 조금 더 긴 답변입니다.' },
    { id: 3, text: '세 번째 추천 답변입니다.' },
];

export function MyRepliesPanel() {
    // In a real implementation, you would use a query hook like this:
    // const { data: replies, isLoading } = useGetMyRepliesQuery(projectId);

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                    내 추천 답변
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {mockReplies.map((reply) => (
                    <div
                        key={reply.id}
                        className={`cursor-pointer rounded-lg p-3 transition-all hover:bg-muted/80 ${
                            reply.priority ? 'border-2 border-primary bg-primary/10' : 'bg-muted'
                        }`}
                    >
                        <p className="text-sm">{reply.text}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
} 