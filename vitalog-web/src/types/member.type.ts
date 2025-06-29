export interface Member {
    id: number;
    username: string;
    name: string;
    contact: string;
    role: 'PATIENT' | 'PARTNER';
    invitationCode?: string;
} 