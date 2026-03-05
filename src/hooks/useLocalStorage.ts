import { useState, useEffect } from "react";

/**
 * Hook care sincronizează un state React cu localStorage.
 * Orice modificare a valorii este salvată automat.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.warn("useLocalStorage - eroare la scriere:", error);
        }
    };

    // Sincronizare între tab-uri
    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue) as T);
                } catch { /* ignoră */ }
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, [key]);

    return [storedValue, setValue] as const;
}
