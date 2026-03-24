// ============================================================
// features/food/foodConstants.ts
// Constante, tipuri si functii ajutatoare pentru modulul Alimente.
// Centralizate intr-un fisier dedicat pentru a fi reutilizate usor
// in AlimenteTable, AlimentModal si GestionareAlimente.
// ============================================================

import type { Categorie } from '../../types';

// Optiunile pentru dropdown-ul de categorie in formularul de adaugare/editare
export const categorieOptions: { value: string; label: string }[] = [
    { value: 'fructe', label: 'Fructe' },
    { value: 'legume', label: 'Legume' },
    { value: 'carne', label: 'Carne' },
    { value: 'lactate', label: 'Lactate' },
    { value: 'cereale', label: 'Cereale' },
    { value: 'bauturi', label: 'Băuturi' },
    { value: 'altele', label: 'Altele' },
];

// Optiunile pentru filtrul de categorie — include "Toate categoriile" ca prima optiune
// Foloseste spread (...) pentru a adauga categorieOptions fara duplicare
export const categorieFilterOptions = [
    { value: 'all', label: 'Toate categoriile' },
    ...categorieOptions,
];

// Map: valoare categorie → text afisat in interfata (pentru tabel si badge-uri)
export const categorieLabel: Record<Categorie, string> = {
    fructe: 'Fructe',
    legume: 'Legume',
    carne: 'Carne',
    lactate: 'Lactate',
    cereale: 'Cereale',
    bauturi: 'Băuturi',
    altele: 'Altele',
};

// Map: valoare categorie → clasa CSS pentru culoarea badge-ului / avatarului
// Clasele sunt definite in shared.css sau GestionareAlimente.css
export const categorieColorClass: Record<Categorie, string> = {
    fructe: 'cat-fructe',
    legume: 'cat-legume',
    carne: 'cat-carne',
    lactate: 'cat-lactate',
    cereale: 'cat-cereale',
    bauturi: 'cat-bauturi',
    altele: 'cat-altele',
};

// Tipul datelor din formularul de adaugare/editare aliment
export type AlimentForm = {
    nume: string;         // Numele alimentului
    categorie: Categorie; // Categoria selectata
    calorii: number;      // kcal per 100g
    proteine: number;     // grame proteine per 100g
    carbohidrati: number; // grame carbohidrati per 100g
    grasimi: number;      // grame grasimi per 100g
};

// Returneaza un formular gol cu valori implicite — folosit la deschiderea modalului de adaugare
export const emptyAlimentForm = (): AlimentForm => ({
    nume: '',
    categorie: 'altele', // Categoria implicita
    calorii: 0,
    proteine: 0,
    carbohidrati: 0,
    grasimi: 0,
});

// Valideaza datele din formular inainte de salvare
// Returneaza un string cu eroarea sau '' daca totul e valid
export function validateAlimentForm(form: AlimentForm): string {
    if (!form.nume.trim()) return 'Numele alimentului este obligatoriu.';
    if (form.calorii < 0 || form.proteine < 0 || form.carbohidrati < 0 || form.grasimi < 0)
        return 'Valorile nutriționale nu pot fi negative.';
    return ''; // Valid
}

// Genereaza un ID unic bazat pe timestamp + random, fara dependente externe
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
