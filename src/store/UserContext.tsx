import React, { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// ─── Tipuri ───────────────────────────────────────────────────────────────────

export interface UserProfile {
    fullName: string;
    email: string;
    heightCm: number;
    weightKg: number;
    age: number;
    gender: "M" | "F" | "altul";
    memberSince: string;   // ex. "Ian 2025"
}

export interface UserGoals {
    calorieGoalKcal: number;
    waterGoalMl: number;
    stepsGoal: number;
}

export interface UserSettings {
    // Aspect
    darkMode: boolean;
    accentColor: string;
    fontSize: number;
    compactMode: boolean;
    animations: boolean;
    // Limbă
    language: string;
    timezone: string;
    units: "metric" | "imperial";
    dateFormat: string;
    // Notificări
    notifEmail: boolean;
    notifPush: boolean;
    notifReport: boolean;
    notifAppt: boolean;
    notifTips: boolean;
    // Securitate
    twoFA: boolean;
    loginAlerts: boolean;
    sessionTimeout: string;
    // Date
    shareData: boolean;
    analytics: boolean;
    autoBackup: boolean;
}

export interface DailyLog {
    date: string;           // "YYYY-MM-DD"
    caloriesKcal: number;
    waterMl: number;
}

export interface AppState {
    profile: UserProfile;
    goals: UserGoals;
    settings: UserSettings;
    dailyLogs: Record<string, DailyLog>;
    todayWaterMl: number;   // stare rapidă pentru azi
}

// ─── Valorile implicite ───────────────────────────────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
    fullName: "Ion Popescu",
    email: "ion.popescu@gmail.com",
    heightCm: 182,
    weightKg: 78,
    age: 24,
    gender: "M",
    memberSince: "Ian 2025",
};

const DEFAULT_GOALS: UserGoals = {
    calorieGoalKcal: 2200,
    waterGoalMl: 3000,
    stepsGoal: 10000,
};

const DEFAULT_SETTINGS: UserSettings = {
    darkMode: false,
    accentColor: "indigo",
    fontSize: 14,
    compactMode: false,
    animations: true,
    language: "ro",
    timezone: "Europe/Bucharest",
    units: "metric",
    dateFormat: "DD/MM/YYYY",
    notifEmail: true,
    notifPush: true,
    notifReport: false,
    notifAppt: true,
    notifTips: false,
    twoFA: false,
    loginAlerts: true,
    sessionTimeout: "30",
    shareData: false,
    analytics: true,
    autoBackup: true,
};

const DEFAULT_STATE: AppState = {
    profile: DEFAULT_PROFILE,
    goals: DEFAULT_GOALS,
    settings: DEFAULT_SETTINGS,
    dailyLogs: {},
    todayWaterMl: 1200,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface UserContextValue {
    state: AppState;
    updateProfile: (patch: Partial<UserProfile>) => void;
    updateGoals: (patch: Partial<UserGoals>) => void;
    updateSettings: (patch: Partial<UserSettings>) => void;
    addWater: (ml: number) => void;
    setTodayWater: (ml: number) => void;
    logDay: (date: string, data: Partial<DailyLog>) => void;
    resetData: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useLocalStorage<AppState>("tweb_app_state", DEFAULT_STATE);

    const updateProfile = useCallback((patch: Partial<UserProfile>) => {
        setState(prev => ({ ...prev, profile: { ...prev.profile, ...patch } }));
    }, [setState]);

    const updateGoals = useCallback((patch: Partial<UserGoals>) => {
        setState(prev => ({ ...prev, goals: { ...prev.goals, ...patch } }));
    }, [setState]);

    const updateSettings = useCallback((patch: Partial<UserSettings>) => {
        setState(prev => ({ ...prev, settings: { ...prev.settings, ...patch } }));
    }, [setState]);

    const setTodayWater = useCallback((ml: number) => {
        setState(prev => ({ ...prev, todayWaterMl: Math.max(0, Math.min(ml, prev.goals.waterGoalMl)) }));
    }, [setState]);

    const addWater = useCallback((ml: number) => {
        setState(prev => ({
            ...prev,
            todayWaterMl: Math.max(0, Math.min(prev.todayWaterMl + ml, prev.goals.waterGoalMl)),
        }));
    }, [setState]);

    const logDay = useCallback((date: string, data: Partial<DailyLog>) => {
        setState(prev => ({
            ...prev,
            dailyLogs: {
                ...prev.dailyLogs,
                [date]: { ...(prev.dailyLogs[date] ?? { date, caloriesKcal: 0, waterMl: 0 }), ...data },
            },
        }));
    }, [setState]);

    const resetData = useCallback(() => {
        setState(DEFAULT_STATE);
    }, [setState]);

    return (
        <UserContext.Provider value={{
            state, updateProfile, updateGoals, updateSettings,
            addWater, setTodayWater, logDay, resetData,
        }}>
            {children}
        </UserContext.Provider>
    );
};

// ─── Hook de acces ────────────────────────────────────────────────────────────

export function useUser(): UserContextValue {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser trebuie folosit în interiorul <UserProvider>");
    return ctx;
}

/** Shortcut pentru profilul utilizatorului */
export function useProfile() {
    const { state, updateProfile } = useUser();
    return { profile: state.profile, updateProfile };
}

/** Shortcut pentru setări */
export function useSettings() {
    const { state, updateSettings } = useUser();
    return { settings: state.settings, updateSettings };
}

/** Shortcut pentru obiective */
export function useGoals() {
    const { state, updateGoals } = useUser();
    return { goals: state.goals, updateGoals };
}
