// AlimenteConstants — constante și map-uri pentru pagina Gestionare Alimente
import type { Categorie } from '../../types';

export const categorieOptions: { value: string; label: string }[] = [
    { value: 'fructe', label: 'Fructe' },
    { value: 'legume', label: 'Legume' },
    { value: 'carne', label: 'Carne' },
    { value: 'lactate', label: 'Lactate' },
    { value: 'cereale', label: 'Cereale' },
    { value: 'bauturi', label: 'Băuturi' },
    { value: 'altele', label: 'Altele' },
];

export const categorieFilterOptions = [
    { value: 'all', label: 'Toate categoriile' },
    ...categorieOptions,
];

export const categorieLabel: Record<Categorie, string> = {
    fructe: 'Fructe',
    legume: 'Legume',
    carne: 'Carne',
    lactate: 'Lactate',
    cereale: 'Cereale',
    bauturi: 'Băuturi',
    altele: 'Altele',
};

export const categorieColorClass: Record<Categorie, string> = {
    fructe: 'cat-fructe',
    legume: 'cat-legume',
    carne: 'cat-carne',
    lactate: 'cat-lactate',
    cereale: 'cat-cereale',
    bauturi: 'cat-bauturi',
    altele: 'cat-altele',
};

export type AlimentForm = {
    nume: string;
    categorie: Categorie;
    calorii: number;
    proteine: number;
    carbohidrati: number;
    grasimi: number;
};

export const emptyAlimentForm = (): AlimentForm => ({
    nume: '',
    categorie: 'altele',
    calorii: 0,
    proteine: 0,
    carbohidrati: 0,
    grasimi: 0,
});

export function validateAlimentForm(form: AlimentForm): string {
    if (!form.nume.trim()) return 'Numele alimentului este obligatoriu.';
    if (form.calorii < 0 || form.proteine < 0 || form.carbohidrati < 0 || form.grasimi < 0)
        return 'Valorile nutriționale nu pot fi negative.';
    return '';
}

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
