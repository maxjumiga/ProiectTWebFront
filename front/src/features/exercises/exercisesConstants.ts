// ============================================================
// features/exercises/exercisesConstants.ts
// Constante, tipuri si functii ajutatoare pentru modulul Exercitii.
// Centralizate intr-un fisier dedicat pentru a fi reutilizate usor
// in ExercitiiTable, ExercitiiModal si GestionareExercitii.
// ============================================================

import type { Exercitiu } from '../../types';

// Tipul local pentru grupele musculare (reexportat si din types/index.ts)
export type GrupMuscular =
    | 'piept'
    | 'spate'
    | 'umeri'
    | 'brate'
    | 'abdomen'
    | 'picioare'
    | 'cardio'
    | 'altele';

// Nivelul de dificultate al exercitiului
export type DificultateExercitiu = 'incepator' | 'intermediar' | 'avansat';

// Optiunile pentru dropdown-ul de grupa musculara in formular
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

// Optiunile pentru filtrul de grupa musculara — include "Toate grupele"
export const grupMuscularFilterOptions = [
    { value: 'all', label: 'Toate grupele' },
    ...grupMuscularOptions, // Spread: adauga toate grupele fara duplicare
];

// Optiunile pentru dropdown-ul de dificultate in formular
export const dificultateOptions: { value: string; label: string }[] = [
    { value: 'incepator', label: 'Începător' },
    { value: 'intermediar', label: 'Intermediar' },
    { value: 'avansat', label: 'Avansat' },
];

// Map: valoare grupa → text afisat in badge-uri si tabel
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

// Map: valoare grupa → clasa CSS pentru culoarea badge-ului / avatarului
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

// Map: valoare dificultate → clasa CSS pentru colorarea badge-ului
export const dificultateColorClass: Record<DificultateExercitiu, string> = {
    incepator: 'dif-incepator',
    intermediar: 'dif-intermediar',
    avansat: 'dif-avansat',
};

// Map: valoare dificultate → text afisat in interfata
export const dificultateLabel: Record<DificultateExercitiu, string> = {
    incepator: 'Începător',
    intermediar: 'Intermediar',
    avansat: 'Avansat',
};

// Tipul datelor din formularul de adaugare/editare exercitiu
export type ExercitiiForm = {
    nume: string;                      // Numele exercitiului
    grupMuscular: GrupMuscular;        // Grupa musculara principala
    dificultate: DificultateExercitiu; // Nivelul de dificultate
    descriere: string;                 // Descriere optionala (tehnica, sfaturi)
    durataMed: number;                 // Durata medie in minute
};

// Returneaza un formular gol cu valori implicite — folosit la deschiderea modalului de adaugare
export const emptyExercitiiForm = (): ExercitiiForm => ({
    nume: '',
    grupMuscular: 'altele',    // Grupa implicita
    dificultate: 'incepator',  // Dificultate implicita
    descriere: '',
    durataMed: 0,
});

// Valideaza datele din formular inainte de salvare
// Returneaza un string cu eroarea sau '' daca totul e valid
export function validateExercitiiForm(form: ExercitiiForm): string {
    if (!form.nume.trim()) return 'Numele exercițiului este obligatoriu.';
    if (form.durataMed < 0) return 'Durata nu poate fi negativă.';
    return ''; // Valid
}

// Genereaza un ID unic bazat pe timestamp + random, fara dependente externe
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Re-exportam tipul Exercitiu pentru a-l putea importa direct din acest modul
export type { Exercitiu };
