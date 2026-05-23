import type { CostOboseala, DificultateExercitiu, GrupMuscular } from '../../types';

export const grupMuscularOptions: { value: string; label: string }[] = [
    { value: 'neck', label: 'Neck' },
    { value: 'traps', label: 'Traps' },
    { value: 'back', label: 'Back' },
    { value: 'lats', label: 'Lats' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'chest', label: 'Chest' },
    { value: 'biceps', label: 'Biceps' },
    { value: 'triceps', label: 'Triceps' },
    { value: 'forearms', label: 'Forearms' },
    { value: 'abs', label: 'Abs' },
    { value: 'glutes', label: 'Glutes' },
    { value: 'quads', label: 'Quads' },
    { value: 'hamstrings', label: 'Hamstrings' },
    { value: 'calves', label: 'Calves' },
];

export const grupMuscularFilterOptions = [
    { value: 'all', label: 'All muscle groups' },
    ...grupMuscularOptions,
];

export const dificultateOptions: { value: string; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
];

export const costObosealaOptions: { value: string; label: string }[] = [
    { value: 'veryLow', label: 'Very Low' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'veryHigh', label: 'Very High' },
];

export const grupMuscularLabel: Record<GrupMuscular, string> = {
    neck: 'Neck',
    traps: 'Traps',
    back: 'Back',
    lats: 'Lats',
    shoulders: 'Shoulders',
    chest: 'Chest',
    biceps: 'Biceps',
    triceps: 'Triceps',
    forearms: 'Forearms',
    abs: 'Abs',
    glutes: 'Glutes',
    quads: 'Quads',
    hamstrings: 'Hamstrings',
    calves: 'Calves',
};

export const grupColorClass: Record<GrupMuscular, string> = {
    neck: 'ex-altele',
    traps: 'ex-spate',
    back: 'ex-spate',
    lats: 'ex-spate',
    shoulders: 'ex-umeri',
    chest: 'ex-piept',
    biceps: 'ex-brate',
    triceps: 'ex-brate',
    forearms: 'ex-brate',
    abs: 'ex-abdomen',
    glutes: 'ex-picioare',
    quads: 'ex-picioare',
    hamstrings: 'ex-picioare',
    calves: 'ex-picioare',
};

export const dificultateColorClass: Record<DificultateExercitiu, string> = {
    beginner: 'dif-incepator',
    intermediate: 'dif-intermediar',
    advanced: 'dif-avansat',
};

export const dificultateLabel: Record<DificultateExercitiu, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

export const costObosealaLabel: Record<CostOboseala, string> = {
    veryLow: 'Very Low',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    veryHigh: 'Very High',
};

export type ExercitiiForm = {
    nume: string;
    grupMuscular: GrupMuscular;
    grupaSecundara: string;
    dificultate: DificultateExercitiu;
    costOboseala: CostOboseala;
};

export const emptyExercitiiForm = (): ExercitiiForm => ({
    nume: '',
    grupMuscular: 'chest',
    grupaSecundara: '',
    dificultate: 'beginner',
    costOboseala: 'low',
});

export function validateExercitiiForm(form: ExercitiiForm): string {
    if (!form.nume.trim()) return 'Exercise name is required.';
    return '';
}
