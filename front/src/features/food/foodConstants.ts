// ============================================================
// features/food/foodConstants.ts
// Constante, tipuri si functii ajutatoare pentru modulul Alimente.
// Aliniate cu modelul real din backend.
// ============================================================

export type AlimentForm = {
    nume: string;
    calorii: number;
    proteine: number;
    carbohidrati: number;
    grasimi: number;
    fibre: number;
    vitaminaC: number;
};

export const emptyAlimentForm = (): AlimentForm => ({
    nume: '',
    calorii: 0,
    proteine: 0,
    carbohidrati: 0,
    grasimi: 0,
    fibre: 0,
    vitaminaC: 0,
});

export function validateAlimentForm(form: AlimentForm): string {
    if (!form.nume.trim()) return 'Food name is required.';

    if (
        form.calorii < 0 ||
        form.proteine < 0 ||
        form.carbohidrati < 0 ||
        form.grasimi < 0 ||
        form.fibre < 0 ||
        form.vitaminaC < 0
    ) {
        return 'Nutritional values cannot be negative.';
    }

    return '';
}
