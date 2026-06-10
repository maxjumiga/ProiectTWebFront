import type {
    Aliment,
    DificultateExercitiu,
    Exercitiu,
    GrupMuscular,
    Role,
    User,
} from '../types';

const API_BASE = 'http://localhost:5004/api';

function getHeaders() {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
            ...getHeaders(),
            ...(init?.headers ?? {}),
        },
    });

    if (!response.ok) {
        // Token expirat sau invalid — sterge sesiunea si redirectioneaza la login
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }
        const message = await response.text();
        throw new Error(message || 'Request failed.');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

function normalizeRole(role: string): Role {
    return role.toLowerCase() === 'admin' ? 'admin' : 'user';
}

function normalizeDifficulty(value: string): DificultateExercitiu {
    const normalized = value.toLowerCase();
    if (normalized === 'advanced') return 'advanced';
    if (normalized === 'intermediate') return 'intermediate';
    return 'beginner';
}

function normalizeMuscleGroup(value: string): GrupMuscular {
    return (value.charAt(0).toLowerCase() + value.slice(1)) as GrupMuscular;
}

function toPascalCase(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export async function getAdminUsers(): Promise<User[]> {
    const data = await request<Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        onboardingCompleted: boolean;
        twoFactorEnabled: boolean;
    }>>('/User/GetAllUsers');

    return data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: normalizeRole(user.role),
        onboardingCompleted: user.onboardingCompleted,
        twoFactorEnabled: user.twoFactorEnabled,
    }));
}

export async function deleteAdminUser(id: number) {
    await request(`/User/DeleteUser/${id}`, { method: 'DELETE' });
}

export async function updateUserRole(id: number, role: 'admin' | 'user') {
    const roleParam = role === 'admin' ? 'Admin' : 'User';
    await request(`/User/SetRole/${id}?role=${roleParam}`, { method: 'PUT' });
}

export async function getAdminFoods(): Promise<Aliment[]> {
    const data = await request<Array<{
        id: number;
        name: string;
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber: number;
        vitaminC: number;
    }>>('/food/list');

    return data.map(food => ({
        id: food.id,
        nume: food.name,
        calorii: food.calories,
        proteine: food.protein,
        carbohidrati: food.carbohydrates,
        grasimi: food.fat,
        fibre: food.fiber,
        vitaminaC: food.vitaminC,
    }));
}

export async function createAdminFood(food: Omit<Aliment, 'id'>) {
    await request('/food/create', {
        method: 'POST',
        body: JSON.stringify({
            name: food.nume,
            calories: food.calorii,
            protein: food.proteine,
            carbohydrates: food.carbohidrati,
            fat: food.grasimi,
            fiber: food.fibre,
            vitaminC: food.vitaminaC,
        }),
    });
}

export async function updateAdminFood(id: number, food: Omit<Aliment, 'id'>) {
    await request(`/food/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: food.nume,
            calories: food.calorii,
            protein: food.proteine,
            carbohydrates: food.carbohidrati,
            fat: food.grasimi,
            fiber: food.fibre,
            vitaminC: food.vitaminaC,
        }),
    });
}

export async function deleteAdminFood(id: number) {
    await request(`/food/${id}`, { method: 'DELETE' });
}

export async function getAdminExercises(): Promise<Exercitiu[]> {
    const data = await request<Array<{
        id: number;
        name: string;
        primaryMuscleGroup: string;
        secondaryMuscleGroup?: string;
        difficulty: string;
    }>>('/exercise/list');

    return data.map(exercise => ({
        id: exercise.id,
        nume: exercise.name,
        grupMuscular: normalizeMuscleGroup(exercise.primaryMuscleGroup),
        grupaSecundara: exercise.secondaryMuscleGroup ?? '',
        dificultate: normalizeDifficulty(exercise.difficulty),
    }));
}

export async function createAdminExercise(exercise: Omit<Exercitiu, 'id'>) {
    await request('/exercise/create', {
        method: 'POST',
        body: JSON.stringify({
            name: exercise.nume,
            primaryMuscleGroup: toPascalCase(exercise.grupMuscular),
            secondaryMuscleGroup: exercise.grupaSecundara || null,
            difficulty: toPascalCase(exercise.dificultate),
        }),
    });
}

export async function updateAdminExercise(id: number, exercise: Omit<Exercitiu, 'id'>) {
    await request(`/exercise/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: exercise.nume,
            primaryMuscleGroup: toPascalCase(exercise.grupMuscular),
            secondaryMuscleGroup: exercise.grupaSecundara || null,
            difficulty: toPascalCase(exercise.dificultate),
        }),
    });
}

export async function deleteAdminExercise(id: number) {
    await request(`/exercise/delete/${id}`, { method: 'DELETE' });
}
