import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
});

export const signUpSchema = z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    name: z.string().min(1, { message: 'Name is required.' }),
    contact: z.string().min(1, { message: 'Contact is required.' }),
    role: z.enum(['PATIENT', 'PARTNER']),
}); 