'use client';

import { useCallback, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Bot, FileUp, Loader2, ChevronsRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';

import withAuth from '@/shared/UI/withAuth';
import { Button } from '@/shared/UI/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/UI/card';
import { DataTable } from '@/shared/UI/data-table';
import { Dropzone } from '@/shared/UI/dropzone';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/shared/UI/resizable';
import { ScrollArea } from '@/shared/UI/scroll-area';
import { Skeleton } from '@/shared/UI/skeleton';
import { useGetProjectDetailsQuery, ProjectDetails } from '@/shared/hook/query/useGetProjectDetailsQuery';
import { useGetChatsQuery, Chat } from '@/shared/hook/query/useGetChatsQuery';
import { useUploadChatsMutation } from '@/shared/hook/mutation/useUploadChatsMutation';
import { useAnalyzeChatMutation } from '@/shared/hook/mutation/useAnalyzeChatMutation';

const chatTableColumns: ColumnDef<Chat>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'message',
        header: 'Message',
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => new Date(row.original.date).toLocaleString(),
    },
];

function ProjectDetailView({ projectId }: { projectId: string }) {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedSummary, setSelectedSummary] = useState<ProjectDetails['summaries'][0] | null>(null);

    const { data: project, isLoading: isLoadingProject, isError: isErrorProject } = useGetProjectDetailsQuery(projectId);
    const { data: chats, isLoading: isLoadingChats, isError: isErrorChats } = useGetChatsQuery(projectId);
    const uploadMutation = useUploadChatsMutation(projectId);
    const analyzeMutation = useAnalyzeChatMutation(projectId);
    
    const handleFileDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);

    const handleUpload = () => {
        if (selectedFile) {
            uploadMutation.mutate(selectedFile, {
                onSuccess: () => setSelectedFile(null),
            });
        }
    };
    
    const handleAnalyze = async () => {
        const data = await analyzeMutation.mutateAsync();
        if(data && project?.summaries) {
            // This is a bit of a hack to get the latest summary.
            // In a real app, the analyze endpoint should return the new summary object.
            queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] });
        }
    };

    const analysisResult = useMemo(() => {
        if (analyzeMutation.data?.summary) return analyzeMutation.data.summary;
        if(selectedSummary) return selectedSummary.content;
        if(project?.summaries && project.summaries.length > 0) {
             // select the most recent one by default
            const sortedSummaries = [...project.summaries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return sortedSummaries[0].content;
        }
        return 'No analysis available. Click "Analyze Chat" to generate one.';
    }, [analyzeMutation.data, selectedSummary, project]);

    if (isLoadingProject) {
        return (
            <div className="p-8">
                <Skeleton className="h-10 w-48 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-[80vh] w-full" />
                    <Skeleton className="h-[80vh] w-full" />
                    <Skeleton className="h-[80vh] w-full" />
                </div>
            </div>
        );
    }

    if (isErrorProject) {
        return <div className="p-8 text-destructive">Failed to load project details.</div>;
    }
    
    return (
        <div className="h-screen flex flex-col">
            <header className="flex items-center justify-between border-b p-4">
                <Button variant="ghost" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">{project?.name}</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleUpload} disabled={!selectedFile || uploadMutation.isPending}>
                        {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                        Upload{selectedFile ? ` ${selectedFile.name}` : ''}
                    </Button>
                    <Button onClick={handleAnalyze} disabled={analyzeMutation.isPending || !chats || chats.length === 0}>
                        {analyzeMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        Analyze Chat
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={20}>
                        <Card className="h-full rounded-none border-0 border-r">
                            <CardHeader>
                                <CardTitle>Summary History</CardTitle>
                                <CardDescription>Select a past summary to view.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[calc(100vh-150px)]">
                                    <ul>
                                        {project?.summaries.map((summary) => (
                                            <li
                                                key={summary.id}
                                                className="p-2 hover:bg-muted cursor-pointer rounded flex justify-between items-center"
                                                onClick={() => setSelectedSummary(summary)}
                                            >
                                                <span className='text-sm'>Summary from {new Date(summary.createdAt).toLocaleString()}</span>
                                                <ChevronsRight className="h-4 w-4 text-muted-foreground" />
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={50}>
                         <Card className="h-full rounded-none border-0">
                            <CardHeader>
                                <CardTitle>Chat Log</CardTitle>
                                <Dropzone onDrop={handleFileDrop} />
                            </CardHeader>
                            <CardContent>
                                {isLoadingChats ? (
                                    <Skeleton className="h-[calc(100vh-250px)] w-full" />
                                ) : isErrorChats ? (
                                    <p className='text-destructive'>Failed to load chats.</p>
                                ) : (
                                    <DataTable columns={chatTableColumns} data={chats || []} />
                                )}
                            </CardContent>
                        </Card>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={30}>
                        <Card className="h-full rounded-none border-0 border-l">
                            <CardHeader>
                                <CardTitle>Analysis Result</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[calc(100vh-150px)]">
                                    <p className="whitespace-pre-wrap">{analysisResult}</p>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>
        </div>
    );
}


function ProjectDetailPage() {
    const params = useParams();
    const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!projectId) {
        return (
            <div className="flex h-screen items-center justify-center text-destructive">
                Project ID not found.
            </div>
        );
    }

    return <ProjectDetailView projectId={projectId} />;
}

export default withAuth(ProjectDetailPage); 