'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, PlusCircle, User, Settings } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import withAuth from '@/shared/UI/withAuth';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useGetProjectsQuery } from '@/shared/hook/query/useGetProjectsQuery';
import { Button } from '@/shared/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/UI/card';
import { Skeleton } from '@/shared/UI/skeleton';
import NewProjectModal from '@/shared/UI/modal/NewProjectModal';

function HomePage() {
    const logout = useAuthStore((state) => state.logout);
    const { data: projects, isLoading, isError, refetch } = useGetProjectsQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth-storage');
        queryClient.clear();
    };

    const renderProjects = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                </Card>
            ));
        }

        if (isError) {
            return <p className="text-destructive">Failed to load projects.</p>;
        }

        if (!projects || projects.length === 0) {
            return <p>You have no projects yet. Create one to get started!</p>;
        }

        return projects.map((project) => (
            <Link key={project.id} href={`/project/${project.id}`} passHref>
                <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Created on: {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
            </Link>
        ));
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between">
                    <h1 className="text-xl font-bold">Chat Analysis</h1>
                    <nav className="flex items-center space-x-2">
                        <Button variant="ghost" asChild>
                            <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{renderProjects()}</div>
            </main>

            <NewProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={() => refetch()}
            />
        </div>
    );
}

export default withAuth(HomePage);
