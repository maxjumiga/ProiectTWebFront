/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    ASSETS / calculations.ts                      ║
 * ║  Toate formulele și calculele folosite în aplicație.             ║
 * ║  Importează din acest fișier, NU din utils/calculations.ts.      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ─── BMI ─────────────────────────────────────────────────────────────────────

export type BmiCategory = "subponderal" | "normal" | "supraponderal" | "obez";

export interface BmiResult {
    value: number;
    category: BmiCategory;
    label: string;
    bg: string;
    color: string;
    /** poziție 0-100% pe bara gradientului (15→40) */
    barPosition: string;
}

/** Calculează BMI (înălțime în cm, greutate în kg) */
export function calcBMI(heightCm: number, weightKg: number): number {
    if (heightCm <= 0 || weightKg <= 0) return 0;
    return weightKg / ((heightCm / 100) ** 2);
}

export function getBmiResult(heightCm: number, weightKg: number): BmiResult {
    const value = calcBMI(heightCm, weightKg);
    let category: BmiCategory;
    let label: string;
    let bg: string;
    let color: string;

    if (value < 18.5) { category = "subponderal"; label = "Subponderal"; bg = "#bfdbfe"; color = "#1d4ed8"; }
    else if (value < 25) { category = "normal"; label = "Sănătos"; bg = "#bbf7d0"; color = "#065f46"; }
    else if (value < 30) { category = "supraponderal"; label = "Supraponderal"; bg = "#fed7aa"; color = "#9a3412"; }
    else { category = "obez"; label = "Obez"; bg = "#fecdd3"; color = "#9f1239"; }

    const barPosition = `${Math.min(Math.max((value - 15) / 25, 0), 1) * 100}%`;
    return { value, category, label, bg, color, barPosition };
}

/** Greutatea ideală după formula Devine (kg) */
export function idealWeight(heightCm: number, gender: "M" | "F" | "altul"): number {
    const inches = (heightCm - 152.4) / 2.54;
    if (gender === "F") return 45.5 + 2.3 * inches;
    return 50 + 2.3 * inches; // M sau altul
}

// ─── BMR & TDEE ──────────────────────────────────────────────────────────────

export type ActivityLevel =
    | "sedentar"        // fără exerciții
    | "usor_activ"      // exerciții 1-3 zile/săpt.
    | "moderat_activ"   // exerciții 3-5 zile/săpt.
    | "foarte_activ"    // exerciții 6-7 zile/săpt.
    | "extrem_activ";   // antrenamente de 2× pe zi

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
    sedentar: 1.2,
    usor_activ: 1.375,
    moderat_activ: 1.55,
    foarte_activ: 1.725,
    extrem_activ: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
    sedentar: "Sedentar",
    usor_activ: "Ușor activ",
    moderat_activ: "Moderat activ",
    foarte_activ: "Foarte activ",
    extrem_activ: "Extrem de activ",
};

/**
 * Rata metabolică bazală — formula Harris-Benedict revizuită (Mifflin-St Jeor).
 * @returns kcal/zi necesare în repaus total
 */
export function calcBMR(
    weightKg: number,
    heightCm: number,
    age: number,
    gender: "M" | "F" | "altul",
): number {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === "M") return base + 5;
    if (gender === "F") return base - 161;
    return base - 78; // medie
}

/**
 * Necesarul caloric zilnic total (TDEE = Total Daily Energy Expenditure).
 */
export function calcTDEE(
    weightKg: number,
    heightCm: number,
    age: number,
    gender: "M" | "F" | "altul",
    activity: ActivityLevel = "moderat_activ",
): number {
    return Math.round(calcBMR(weightKg, heightCm, age, gender) * ACTIVITY_MULTIPLIER[activity]);
}

// ─── Calorii ─────────────────────────────────────────────────────────────────

/** Procentaj calorii consumate față de obiectiv */
export function calcCaloriePct(consumed: number, goal: number): number {
    if (goal <= 0) return 0;
    return Math.round((consumed / goal) * 100);
}

/** Returnează culoarea progresului caloric (verde → portocaliu → roșu) */
export function calorieColor(pct: number): string {
    if (pct < 80) return "#10b981";
    if (pct < 100) return "#f97316";
    return "#f43f5e";
}

// ─── Macronutrienți ───────────────────────────────────────────────────────────

export interface MacroTargets {
    proteinG: number;   // grame proteine
    carbsG: number;     // grame carbohidrați
    fatG: number;       // grame grăsimi
}

/**
 * Calculează macronutrienții recomandați pe baza TDEE.
 * Distribuție: 30% proteine, 45% carbohidrați, 25% grăsimi.
 */
export function calcMacros(tdeeKcal: number): MacroTargets {
    return {
        proteinG: Math.round((tdeeKcal * 0.30) / 4),
        carbsG: Math.round((tdeeKcal * 0.45) / 4),
        fatG: Math.round((tdeeKcal * 0.25) / 9),
    };
}

// ─── Apă ─────────────────────────────────────────────────────────────────────

/** Procentaj apă consumată față de obiectiv */
export function calcWaterPct(consumedMl: number, goalMl: number): number {
    if (goalMl <= 0) return 0;
    return Math.min(consumedMl / goalMl, 1);
}

/** Conversia ml → string afișabil */
export function formatWater(ml: number): string {
    if (ml >= 1000) return `${(ml / 1000).toFixed(1)} L`;
    return `${ml} ml`;
}

/**
 * Calcul aport recomandat de apă (ml/zi).
 * Formulă simplificată: 35 ml × kg greutate corporală.
 */
export function recommendedWaterMl(weightKg: number): number {
    return Math.round(weightKg * 35);
}

// ─── General ─────────────────────────────────────────────────────────────────

/** Calculează inițialele din numele complet (max 2 litere) */
export function getInitials(fullName: string): string {
    return fullName
        .split(" ")
        .filter(Boolean)
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/** Durată antrenament din ore:minute */
export function formatDuration(from: string, to: string): string {
    const [fh, fm] = from.split(":").map(Number);
    const [th, tm] = to.split(":").map(Number);
    const mins = th * 60 + tm - (fh * 60 + fm);
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/** Formatează un număr de calorii cu separatoare mifare */
export function formatKcal(kcal: number): string {
    return kcal.toLocaleString("ro-RO") + " kcal";
}

/**
 * Calculează procentul de grăsime corporală estimat pe baza BMI
 * (formula Deurenberg).
 */
export function estimateBodyFatPct(
    bmi: number,
    age: number,
    gender: "M" | "F" | "altul",
): number {
    const sexFactor = gender === "M" ? 1 : 0;
    return parseFloat((1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4).toFixed(1));
}
