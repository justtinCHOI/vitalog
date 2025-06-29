'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import withAuth from '@/shared/UI/withAuth';
import { useGetMemberInfoQuery } from '@/shared/hook/query/useGetMemberInfoQuery';
import { useGetConnectionsQuery } from '@/shared/hook/query/useGetConnectionsQuery';
import { useGenerateCodeMutation } from '@/shared/hook/mutation/useGenerateCodeMutation';
import {
    useRegisterPatientMutation,
    registerPatientSchema,
} from '@/shared/hook/mutation/useRegisterPatientMutation';
import { Button } from '@/shared/UI/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/UI/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/UI/form';
import { Input } from '@/shared/UI/input';
import { Skeleton } from '@/shared/UI/skeleton';
import { useToast } from '@/shared/UI/toast/use-toast';
import type { Member } from '@/types/member.type';

function ProfilePage() {
    const queryClient = useQueryClient();
    const { data: memberInfo, isLoading, isError } = useGetMemberInfoQuery();
    const {
        data: connections,
        isLoading: isLoadingConnections,
        isError: isErrorConnections,
    } = useGetConnectionsQuery();
    const generateCodeMutation = useGenerateCodeMutation();
    const registerPatientMutation = useRegisterPatientMutation();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof registerPatientSchema>>({
        resolver: zodResolver(registerPatientSchema),
        defaultValues: {
            invitationCode: '',
        },
    });

    const handleGenerateCode = () => {
        generateCodeMutation.mutate();
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            toast({
                title: 'Copied!',
                description: 'Invitation code has been copied to your clipboard.',
            });
        });
    };

    function onRegisterPatient(data: z.infer<typeof registerPatientSchema>) {
        registerPatientMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                toast({
                    title: 'Success',
                    description: 'Patient registered successfully.',
                });
                queryClient.invalidateQueries({ queryKey: ['connections'] });
            },
        });
    }

    const renderConnections = (title: string, connectionsList: Member[] | undefined) => {
        if (isLoadingConnections) {
            return (
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            );
        }

        if (isErrorConnections) {
            return <p className="text-destructive">Failed to load {title.toLowerCase()}.</p>;
        }

        if (!connectionsList || connectionsList.length === 0) {
            return <p>No {title.toLowerCase()} found.</p>;
        }

        return (
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <ul className="mt-2 space-y-2">
                    {connectionsList.map((conn) => (
                        <li key={conn.id} className="rounded-md border p-3">
                            <p className="font-medium">{conn.name}</p>
                            <p className="text-sm text-muted-foreground">{conn.contact}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="mt-2 h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError || !memberInfo) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background text-destructive">
                <p>Failed to load user information.</p>
                <Button variant="link" asChild>
                    <Link href="/">Go back to Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <Link href="/" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>View and manage your account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-medium">Name</h3>
                        <p className="text-muted-foreground">{memberInfo.name}</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Role</h3>
                        <p className="text-muted-foreground">{memberInfo.role}</p>
                    </div>

                    {memberInfo.role === 'PATIENT' && (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold">Generate Invitation Code</h3>
                                <div className="mt-4 flex items-center space-x-4">
                                    <Button onClick={handleGenerateCode} disabled={generateCodeMutation.isPending}>
                                        {generateCodeMutation.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        Generate Code
                                    </Button>
                                    {generateCodeMutation.invitationCode && (
                                        <div
                                            className="cursor-pointer rounded-md bg-muted px-4 py-2 font-mono text-sm transition-colors hover:bg-muted/80"
                                            onClick={() => handleCopyCode(generateCodeMutation.invitationCode!)}
                                        >
                                            {generateCodeMutation.invitationCode}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6">{renderConnections('My Partners', connections)}</div>
                        </>
                    )}

                    {memberInfo.role === 'PARTNER' && (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold">Register a Patient</h3>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onRegisterPatient)} className="mt-4 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="invitationCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Patient&apos;s Invitation Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter patient's code" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={registerPatientMutation.isPending}>
                                            {registerPatientMutation.isPending && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Register Patient
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                            <div className="mt-6">{renderConnections('My Patients', connections)}</div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default withAuth(ProfilePage); 