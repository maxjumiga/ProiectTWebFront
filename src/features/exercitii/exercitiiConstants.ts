// exercitiiConstants.ts — constante, tipuri și helpers pentru Gestionare Exerciții
import type { Exercitiu } from '../../types';

export type GrupMuscular =
    | 'piept'
    | 'spate'
    | 'umeri'
    | 'brate'
    | 'abdomen'
    | 'picioare'
    | 'cardio'
    | 'altele';

export type DificultateExercitiu = 'incepator' | 'intermediar' | 'avansat';

export const grupMuscularOptions: { value: string; label: string }[] = [
    { value: 'piept', label: 'Piept' },
    { value: 'spate', label: 'Spate' },
    { value: 'umeri', label: 'Umeri' },
    { value: 'brate', label: 'Brațe' },
    { value: 'abdomen', label: 'Abdomen' },
    { value: 'picioare', label: 'Picioare' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'altele', label: 'Altele' },
];

export const grupMuscularFilterOptions = [
    { value: 'all', label: 'Toate grupele' },
    ...grupMuscularOptions,
];

export const dificultateOptions: { value: string; label: string }[] = [
    { value: 'incepator', label: 'Începător' },
    { value: 'intermediar', label: 'Intermediar' },
    { value: 'avansat', label: 'Avansat' },
];

export const grupMuscularLabel: Record<GrupMuscular, string> = {
    piept: 'Piept',
    spate: 'Spate',
    umeri: 'Umeri',
    brate: 'Brațe',
    abdomen: 'Abdomen',
    picioare: 'Picioare',
    cardio: 'Cardio',
    altele: 'Altele',
};

export const grupColorClass: Record<GrupMuscular, string> = {
    piept: 'ex-piept',
    spate: 'ex-spate',
    umeri: 'ex-umeri',
    brate: 'ex-brate',
    abdomen: 'ex-abdomen',
    picioare: 'ex-picioare',
    cardio: 'ex-cardio',
    altele: 'ex-altele',
};

export const dificultateColorClass: Record<DificultateExercitiu, string> = {
    incepator: 'dif-incepator',
    intermediar: 'dif-intermediar',
    avansat: 'dif-avansat',
};

export const dificultateLabel: Record<DificultateExercitiu, string> = {
    incepator: 'Începător',
    intermediar: 'Intermediar',
    avansat: 'Avansat',
};

export type ExercitiiForm = {
    nume: string;
    grupMuscular: GrupMuscular;
    dificultate: DificultateExercitiu;
    descriere: string;
    durataMed: number; // minute
};

export const emptyExercitiiForm = (): ExercitiiForm => ({
    nume: '',
    grupMuscular: 'altele',
    dificultate: 'incepator',
    descriere: '',
    durataMed: 0,
});

export function validateExercitiiForm(form: ExercitiiForm): string {
    if (!form.nume.trim()) return 'Numele exercițiului este obligatoriu.';
    if (form.durataMed < 0) return 'Durata nu poate fi negativă.';
    return '';
}

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Re-export tipul pentru a-l putea folosi în alte fișiere fără import din types
export type { Exercitiu };
