import { User } from 'firebase/auth';

export const ALLOWED_EMAILS = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(' ');

export const isValid = (user: User | null): boolean => {
    if (ALLOWED_EMAILS?.includes(user?.email as string)) return true;
    return false;
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
