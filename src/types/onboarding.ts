export type Gender = 'male' | 'female' | 'other';
export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface OnboardingData {
    gender: Gender | null;
    age: number | null;
    heightCm: number | null;
    weightKg: number | null;
    goal: Goal | null;
}

