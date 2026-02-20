export type Role = 'admin' | 'user';
export type Status = 'activ' | 'inactiv';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
    joinedAt: string; // ISO date string
}
