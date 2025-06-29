'use client';

import Link from 'next/link';
import * as React from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

import withAuth from '@/shared/UI/withAuth';
import { Button } from '@/shared/UI/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/UI/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/UI/dropdown-menu';
import { useSettingsStore, GptLanguage } from '@/shared/store/useSettingsStore';

function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const { gptLanguage, setGptLanguage } = useSettingsStore();

    const handleGptLanguageChange = (lang: GptLanguage) => {
        setGptLanguage(lang);
    };

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <Link href="/" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account and app settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="text-lg font-medium">Theme</h3>
                        <p className="text-sm text-muted-foreground mb-2">Select a theme for the application.</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <span className="capitalize">{theme}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme('light')}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('dark')}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('system')}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Language</h3>
                        <p className="text-sm text-muted-foreground mb-2">Select the display language.</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-[120px]">
                                    {i18n.language === 'en' && 'English'}
                                    {i18n.language === 'ko' && '한국어'}
                                    {i18n.language === 'es' && 'Español'}
                                    {i18n.language === 'fr' && 'Français'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => i18n.changeLanguage('ko')}>
                                    한국어
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => i18n.changeLanguage('es')}>
                                    Español
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => i18n.changeLanguage('fr')}>
                                    Français
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">GPT Output Language</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            Select the language for analysis results.
                        </p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <span>{gptLanguage.charAt(0).toUpperCase() + gptLanguage.slice(1)}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleGptLanguageChange('default')}>
                                    Default
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGptLanguageChange('en')}>
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGptLanguageChange('ko')}>
                                    Korean
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGptLanguageChange('es')}>
                                    Spanish
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default withAuth(SettingsPage); 