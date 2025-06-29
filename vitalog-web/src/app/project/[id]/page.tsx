'use client';

import { useCallback, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Bot,
    FileUp,
    Loader2,
    ChevronsRight,
    Pencil,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    PlusCircle,
    GripVertical,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import withAuth from '@/shared/UI/withAuth';
import { Button } from '@/shared/UI/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/UI/card';
import { DataTable } from '@/shared/UI/data-table';
import { Dropzone } from '@/shared/UI/dropzone';
import { Input } from '@/shared/UI/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/shared/UI/resizable';
import { ScrollArea } from '@/shared/UI/scroll-area';
import { Skeleton } from '@/shared/UI/skeleton';
import { Checkbox } from '@/shared/UI/checkbox';
import { useGetProjectDetailsQuery, ProjectDetails } from '@/shared/hook/query/useGetProjectDetailsQuery';
import { useGetChatsQuery, Chat } from '@/shared/hook/query/useGetChatsQuery';
import { useUploadChatsMutation } from '@/shared/hook/mutation/useUploadChatsMutation';
import { useAnalyzeChatMutation } from '@/shared/hook/mutation/useAnalyzeChatMutation';
import { useUpdateProjectMutation } from '@/shared/hook/mutation/useUpdateProjectMutation';
import { MyRepliesPanel } from './components/MyRepliesPanel';
import { OpponentRepliesPanel } from './components/OpponentRepliesPanel';

type FileItem = {
    id: string;
    file: File;
};

function SortableFileItem({ item, selected, onSelect, onRemove }: { item: FileItem, selected: boolean, onSelect: (id: string, selected: boolean) => void, onRemove: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Button variant="ghost" size="icon" {...listeners} className="cursor-grab">
                <GripVertical className="h-4 w-4" />
            </Button>
            <Checkbox
                checked={selected}
                onCheckedChange={(checked: boolean | 'indeterminate') => onSelect(item.id, !!checked)}
            />
            <span className="flex-1 text-sm truncate">{item.file.name}</span>
            <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}

const chatTableColumns: ColumnDef<Chat>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        size: 100,
    },
    {
        accessorKey: 'message',
        header: 'Message',
        size: 400,
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => new Date(row.original.date).toLocaleString(),
        size: 150,
    },
];

function ProjectDetailView({ projectId }: { projectId: string }) {
    const queryClient = useQueryClient();
    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedSummary, setSelectedSummary] = useState<ProjectDetails['summaries'][0] | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editingName, setEditingName] = useState('');
    const [showAllSummaries, setShowAllSummaries] = useState(false);

    const { data: project, isLoading: isLoadingProject, isError: isErrorProject } = useGetProjectDetailsQuery(projectId);
    const { data: chats, isLoading: isLoadingChats, isError: isErrorChats } = useGetChatsQuery(projectId);
    const uploadMutation = useUploadChatsMutation(projectId);
    const analyzeMutation = useAnalyzeChatMutation(projectId);
    const updateProjectMutation = useUpdateProjectMutation(projectId);
    
    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const handleFileDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [
            ...prev,
            ...acceptedFiles.map(file => ({ id: `${file.name}-${new Date().getTime()}`, file }))
        ]);
    }, []);

    const handleRemoveFile = (idToRemove: string) => {
        setFiles(prev => prev.filter(item => item.id !== idToRemove));
        setSelectedFileIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(idToRemove);
            return newSet;
        });
    };

    const handleSelectFile = (id: string, selected: boolean) => {
        setSelectedFileIds(prev => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        })
    }

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedFileIds(new Set(files.map(f => f.id)));
        } else {
            setSelectedFileIds(new Set());
        }
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
    
    const handleUpload = () => {
        const selectedFiles = files.filter(f => selectedFileIds.has(f.id)).map(f => f.file);
        if (selectedFiles.length > 0) {
            uploadMutation.mutate(selectedFiles, {
                onSuccess: () => {
                    // Clear selection after successful upload
                    setSelectedFileIds(new Set());
                    // Optional: remove uploaded files from the list
                    // setFiles(prev => prev.filter(item => !selectedFileIds.has(item.id)));
                },
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

    const handleStartNewAnalysis = () => {
        setFiles([]);
        setSelectedFileIds(new Set());
        // maybe clear other states like analysis result
    }

    const handleStartEditingName = () => {
        if (project) {
            setIsEditingName(true);
            setEditingName(project.name);
        }
    };

    const handleCancelEditingName = () => {
        setIsEditingName(false);
    };

    const handleSaveName = () => {
        if (editingName.trim()) {
            updateProjectMutation.mutate(editingName, {
                onSuccess: () => {
                    setIsEditingName(false);
                },
            });
        }
    };

    const sortedSummaries = useMemo(() => {
        if (!project?.summaries) return [];
        return [...project.summaries].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [project?.summaries]);

    const analysisResult = useMemo(() => {
        if (analyzeMutation.data?.summary) return analyzeMutation.data.summary;
        if (selectedSummary) return selectedSummary.content;
        if (sortedSummaries.length > 0) {
            return sortedSummaries[0].content;
        }
        return 'No analysis available. Click "Analyze Chat" to generate one.';
    }, [analyzeMutation.data, selectedSummary, sortedSummaries]);

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
                {isEditingName ? (
                    <div className="flex items-center gap-2">
                        <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="text-xl font-bold"
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        />
                        <Button variant="ghost" size="icon" onClick={handleSaveName} disabled={updateProjectMutation.isPending}>
                            <Check className="h-5 w-5 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelEditingName}>
                            <X className="h-5 w-5 text-red-500" />
                        </Button>
                    </div>
                ) : (
                    <div className="group flex cursor-pointer items-center gap-2" onClick={handleStartEditingName}>
                        <h1 className="text-xl font-bold">{project?.name}</h1>
                        <Pencil className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <Button onClick={handleUpload} disabled={selectedFileIds.size === 0 || uploadMutation.isPending}>
                        {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                        Upload {selectedFileIds.size > 0 ? `${selectedFileIds.size} file(s)` : ''}
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
                                <div className="flex items-center justify-between">
                                    <CardTitle>Summary History</CardTitle>
                                </div>
                                <CardDescription>Select a past summary to view.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-auto max-h-[300px] pr-4">
                                    <ul>
                                        <li
                                            className="p-2 hover:bg-muted cursor-pointer rounded flex items-center gap-2"
                                            onClick={handleStartNewAnalysis}
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            <span className="text-sm font-medium">New Analysis</span>
                                        </li>
                                        {sortedSummaries
                                            .slice(0, showAllSummaries ? sortedSummaries.length : 5)
                                            .map((summary) => (
                                                <li
                                                    key={summary.id}
                                                    className={`p-2 hover:bg-muted cursor-pointer rounded flex justify-between items-center ${
                                                        selectedSummary?.id === summary.id ||
                                                        (!selectedSummary &&
                                                            sortedSummaries[0]?.id === summary.id)
                                                            ? 'bg-muted'
                                                            : ''
                                                    }`}
                                                    onClick={() => setSelectedSummary(summary)}
                                                >
                                                    <span className="text-sm truncate">
                                                        Summary from {new Date(summary.createdAt).toLocaleString()}
                                                    </span>
                                                    <ChevronsRight className="h-4 w-4 text-muted-foreground" />
                                                </li>
                                            ))}
                                    </ul>
                                    {sortedSummaries.length > 5 && (
                                        <Button
                                            variant="link"
                                            className="mt-2"
                                            onClick={() => setShowAllSummaries(!showAllSummaries)}
                                        >
                                            {showAllSummaries ? (
                                                <>
                                                    <ChevronUp className="mr-2 h-4 w-4" />
                                                    Show less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="mr-2 h-4 w-4" />
                                                    Show more
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={50}>
                        <Card className="h-full rounded-none border-0">
                            <CardHeader>
                                <CardTitle>Chat Log</CardTitle>
                                <CardDescription className="mt-2">
                                   Add files and select them for analysis. You can reorder files by dragging.
                                </CardDescription>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2 rounded-lg border p-2">
                                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                                            <Checkbox
                                                id="select-all"
                                                checked={files.length > 0 && selectedFileIds.size === files.length}
                                                onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectAll(!!checked)}
                                                disabled={files.length === 0}
                                            />
                                            <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1">
                                                Select All ({selectedFileIds.size}/{files.length})
                                            </label>
                                        </div>
                                        <ScrollArea className="h-[150px]">
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                                                <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                                    <div className="flex flex-col gap-2">
                                                    {files.map(item => (
                                                        <SortableFileItem 
                                                            key={item.id} 
                                                            item={item}
                                                            selected={selectedFileIds.has(item.id)}
                                                            onSelect={handleSelectFile}
                                                            onRemove={handleRemoveFile}
                                                        />
                                                    ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        </ScrollArea>
                                    </div>
                                    <Dropzone onDrop={handleFileDrop} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[calc(100vh-380px)]">
                                    {isLoadingChats ? (
                                        <Skeleton className="h-full w-full" />
                                    ) : isErrorChats ? (
                                        <p className="text-destructive">Failed to load chats.</p>
                                    ) : (
                                        <DataTable columns={chatTableColumns} data={chats || []} />
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={30}>
                        <ScrollArea className="h-screen">
                            <Card className="h-auto rounded-none border-0 border-l">
                                <CardHeader>
                                    <CardTitle>Analysis Result</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {analyzeMutation.isPending ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{analysisResult}</p>
                                    )}
                                </CardContent>
                            </Card>
                            <div className="p-4 pt-0">
                                <MyRepliesPanel />
                                <OpponentRepliesPanel />
                            </div>
                        </ScrollArea>
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