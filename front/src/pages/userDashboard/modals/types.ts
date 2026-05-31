export type MealTime = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface FoodItem {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    vitaminC: number;
    fiber: number;
    unit: string;
}

export interface FoodLog {
    id?: number;
    food: FoodItem;
    mealTime: MealTime;
    grams: number;
}

export interface ExerciseItem {
    id: number;
    name: string;
    primaryMuscleGroup: string;
    secondaryMuscleGroup?: string;
    difficulty: string;
}

export type WorkoutType = "Strength" | "Cardio" | "Mobility";

export interface WorkoutExerciseLog {
    exercise: ExerciseItem;
    sets: number;
    reps: number;
    weight: number;
}

export interface WorkoutLog {
    id?: number;
    date: string;
    duration: number;
    type: WorkoutType;
    label: string;
    exercises: WorkoutExerciseLog[];
}
