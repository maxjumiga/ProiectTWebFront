export type Gender = "male" | "female" | "other" | "";
export type ActivityLevel =
    | "sedentary"
    | "light"
    | "moderate"
    | "very"
    | "athlete"
    | "";
export type Goal = "lose" | "build" | "maintain" | "";

export interface OnboardingData {
    height: number | null;
    weight: number | null;
    gender: Gender;
    age: number | null;
    activityLevel: ActivityLevel;
    goal: Goal;
    goalDetail: string;
    targetWeight: number | null;
    bmr: number | null;
    calorieTarget: number | null;
    proteinTarget: number | null;
    onboardingCompleted: boolean;
}