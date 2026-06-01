// ============================================================
// types/index.ts — Definitiile de tipuri TypeScript pentru intreaga aplicatie
// Toate interfetele si tipurile folosite in proiect sunt centralizate aici
// pentru a evita duplicarea si pentru consistenta datelor
// ============================================================

export type Role = 'admin' | 'user';

export type GrupMuscular =
    | 'neck'
    | 'traps'
    | 'back'
    | 'lats'
    | 'shoulders'
    | 'chest'
    | 'biceps'
    | 'triceps'
    | 'forearms'
    | 'abs'
    | 'glutes'
    | 'quads'
    | 'hamstrings'
    | 'calves';

export type DificultateExercitiu = 'beginner' | 'intermediate' | 'advanced';

export type CostOboseala = 'veryLow' | 'low' | 'moderate' | 'high' | 'veryHigh';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    onboardingCompleted: boolean;
    twoFactorEnabled: boolean;
}

export interface Aliment {
    id: number;
    nume: string;
    calorii: number;
    proteine: number;
    carbohidrati: number;
    grasimi: number;
    fibre: number;
    vitaminaC: number;
}

export interface Exercitiu {
    id: number;
    nume: string;
    grupMuscular: GrupMuscular;
    grupaSecundara: string;
    dificultate: DificultateExercitiu;
    costOboseala: CostOboseala;
}
