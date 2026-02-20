import type { OnboardingData } from "../types/onboarding";

export function calculateBMR(data: OnboardingData): number {
    const { weight, height, age, gender } = data;

    if (!weight || !height || !age) return 0;

    if (gender === "male") {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    }

    return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateCalories(
    bmr: number,
    activity: string,
    goal: string
): number {
    const multipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725,
        athlete: 1.9,
    };

    let calories = bmr * (multipliers[activity] ?? 1);

    if (goal === "lose") calories -= 500;
    if (goal === "build") calories += 300;

    return Math.round(calories);
}

export function calculateProtein(weight: number, goal: string): number {
    const multipliers: Record<string, number> = {
        lose: 2.2,
        build: 2.0,
        maintain: 1.8,
    };

    return Math.round(weight * (multipliers[goal] ?? 1.8));
}