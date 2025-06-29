'use client';

import { useState } from 'react';
import { RefreshCw, Copy } from 'lucide-react';

import { Button } from '@/shared/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/UI/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/UI/select';
import { Skeleton } from '@/shared/UI/skeleton';
import { useToast } from '@/shared/UI/toast/use-toast';

export function MyRepliesPanel() {
    const [tone, setTone] = useState('analysis');
    const [isLoading, setIsLoading] = useState(false);
    const [replies, setReplies] = useState<string[]>([]);
    const { toast } = useToast();

    const handleRefresh = () => {
        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            setReplies([
                `This is a new ${tone} reply suggestion 1.`,
                `This is a new ${tone} reply suggestion 2.`,
                `This is a new ${tone} reply suggestion 3.`,
            ]);
            setIsLoading(false);
        }, 1500);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: 'Copied to clipboard!',
                description: 'The suggested reply has been copied.',
            });
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle>내 추천 답변</CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                    <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="analysis">분석</SelectItem>
                            <SelectItem value="empathy">공감</SelectItem>
                            <SelectItem value="humor">유머</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-2/3" />
                    </>
                ) : replies.length > 0 ? (
                    replies.map((reply, index) => (
                        <div
                            key={index}
                            className="group flex cursor-pointer items-center justify-between rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80"
                            onClick={() => handleCopy(reply)}
                        >
                            <p className="text-sm">{reply}</p>
                            <Copy className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">Click the refresh button to generate replies.</p>
                )}
            </CardContent>
        </Card>
    );
} 