import type { Gender, Goal } from '../types/onboarding';

export function calcBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

export function bmiCategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

/** Mifflin-St Jeor BMR */
export function calcBMR(
    weightKg: number,
    heightCm: number,
    age: number,
    gender: Gender
): number {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return gender === 'female' ? base - 161 : base + 5;
}

/** TDEE with moderate activity (1.55 multiplier) */
export function calcTDEE(bmr: number): number {
    return Math.round(bmr * 1.55);
}

export function goalCalories(tdee: number, goal: Goal): number {
    if (goal === 'lose') return tdee - 500;
    if (goal === 'gain') return tdee + 300;
    return tdee;
}

export function goalLabel(goal: Goal): string {
    const labels: Record<Goal, string> = {
        lose: 'Lose Weight',
        maintain: 'Maintain Weight',
        gain: 'Gain Muscle',
    };
    return labels[goal];
}

export function heightDisplay(cm: number): string {
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${ft}'${inches}" (${cm} cm)`;
}