'use client';

import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { UploadCloud } from 'lucide-react';

interface DropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    className?: string;
}

export function Dropzone({ onDrop, className }: DropzoneProps) {
    const { t } = useTranslation();
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'text/plain': ['.txt'],
        },
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 p-10 text-center transition-colors hover:border-primary',
                isDragActive && 'border-primary bg-accent',
                className
            )}
        >
            <input {...getInputProps()} />
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
                {isDragActive ? t('dropzone.active') : t('dropzone.inactive')}
            </p>
            <p className="text-xs text-muted-foreground/80">{t('dropzone.fileTypes')}</p>
        </div>
    );
} 