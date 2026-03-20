// ============================================================
// types/index.ts — Definitiile de tipuri TypeScript pentru intreaga aplicatie
// Toate interfetele si tipurile folosite in proiect sunt centralizate aici
// pentru a evita duplicarea si pentru consistenta datelor
// ============================================================

// Rolul unui utilizator: administrator sau utilizator simplu
export type Role = 'admin' | 'user';

// Statusul contului unui utilizator: activ sau inactiv
export type Status = 'activ' | 'inactiv';

// Grupele musculare disponibile pentru exercitii
export type GrupMuscular = 'piept' | 'spate' | 'umeri' | 'brate' | 'abdomen' | 'picioare' | 'cardio' | 'altele';

// Nivelul de dificultate al unui exercitiu
export type DificultateExercitiu = 'incepator' | 'intermediar' | 'avansat';

// Structura unui utilizator din sistem
export interface User {
    id: string;        // ID unic al utilizatorului
    name: string;      // Numele complet
    email: string;     // Adresa de email (folosita si ca identificator)
    role: Role;        // Rolul in aplicatie (admin sau user)
    status: Status;    // Statusul contului (activ sau inactiv)
    joinedAt: string;  // Data inregistrarii in format ISO (ex: '2026-01-15')
}

// Categoriile de alimente disponibile in baza de date
export type Categorie =
    | 'fructe'
    | 'legume'
    | 'carne'
    | 'lactate'
    | 'cereale'
    | 'bauturi'
    | 'altele';

// Structura unui aliment din baza de date
export interface Aliment {
    id: string;           // ID unic al alimentului
    nume: string;         // Numele alimentului (ex: "Mere", "Piept de pui")
    categorie: Categorie; // Categoria din care face parte alimentul
    calorii: number;      // Calorii per 100g (kcal)
    proteine: number;     // Proteine per 100g (grame)
    carbohidrati: number; // Carbohidrati per 100g (grame)
    grasimi: number;      // Grasimi per 100g (grame)
}

// Structura unui exercitiu din baza de date
export interface Exercitiu {
    id: string;                        // ID unic al exercitiului
    nume: string;                      // Numele exercitiului (ex: "Flotari", "Alergare")
    grupMuscular: GrupMuscular;        // Grupa musculara principala vizata
    dificultate: DificultateExercitiu; // Nivelul de dificultate
    descriere: string;                 // Descriere optionala a tehnicii de executie
    durataMed: number;                 // Durata medie recomandata in minute
}
