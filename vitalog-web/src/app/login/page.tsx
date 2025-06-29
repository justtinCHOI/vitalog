'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';

import { useLoginMutation } from '@/shared/hook/mutation/useLoginMutation';
import { loginSchema } from '@/shared/schemas/auth';
import { Button } from '@/shared/UI/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/UI/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/UI/form';
import { Input } from '@/shared/UI/input';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const loginMutation = useLoginMutation();
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    function onSubmit(data: z.infer<typeof loginSchema>) {
        loginMutation.mutate(data);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
                    <CardDescription>{t('login.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('login.usernameLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('login.usernamePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('login.passwordLabel')}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder={t('login.passwordPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('login.signInButton')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="mt-4 text-center text-sm">
                        {t('login.signUpPrompt')}{' '}
                        <Link href="/signup" className="underline">
                            {t('login.signUpLink')}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}