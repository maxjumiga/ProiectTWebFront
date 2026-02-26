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

export type Categorie =
    | 'fructe'
    | 'legume'
    | 'carne'
    | 'lactate'
    | 'cereale'
    | 'bauturi'
    | 'altele';

export interface Aliment {
    id: string;
    nume: string;
    categorie: Categorie;
    calorii: number;       // kcal / 100g
    proteine: number;      // g / 100g
    carbohidrati: number;  // g / 100g
    grasimi: number;       // g / 100g
}
