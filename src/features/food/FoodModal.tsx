// ============================================================
// features/food/FoodModal.tsx — Modal adaugare/editare aliment
// Componenta reutilizabila pentru ambele operatii (add si edit).
// Titlul si butonul de salvare se schimba dinamic prin props.
// Formularul contine:
//   - Camp text pentru numele alimentului (obligatoriu)
//   - Dropdown pentru categorie (CustomSelect)
//   - 4 inputuri numerice pentru valorile nutritionale (per 100g)
// Validarea se face in pagina parinte (GestionareAlimente) prin validateAlimentForm
// ============================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import type { Categorie } from '../../types';
import CustomSelect from '../../components/CustomSelect';
import { categorieOptions, type AlimentForm } from './alimenteConstants';

// Componenta interna pentru inputurile nutritionale (proteine, carbohidrati, grasimi)
// Extrasa ca sub-componenta pentru a evita repetarea codului
interface NutrientInputProps {
    label: string;                    // Eticheta campului (ex: "Proteine")
    value: number;                    // Valoarea numerica curenta
    onChange: (v: number) => void;    // Callback la modificare
}

function NutrientInput({ label, value, onChange }: NutrientInputProps) {
    return (
        <div className="form-group">
            <label>{label} <span className="ga-unit">(g/100g)</span></label>
            <input
                className="form-input"
                type="number"
                min={0}
                step={0.1}   // Permite valori cu o zecimala (ex: 2.5g)
                value={value}
                onChange={e => onChange(parseFloat(e.target.value) || 0)}
            />
        </div>
    );
}

// Proprietatile primite de la GestionareAlimente
interface AlimentModalProps {
    title: string;                         // Titlul modalului (ex: "Adaugă Aliment Nou")
    form: AlimentForm;                     // Datele curente ale formularului
    error: string;                         // Mesajul de eroare (gol = fara eroare)
    onFormChange: (form: AlimentForm) => void; // Callback la orice modificare din formular
    onSave: () => void;                    // Callback la apasarea butonului de salvare
    onClose: () => void;                   // Callback la inchidere/anulare
    saveLabel?: string;                    // Textul butonului de salvare (default: "Salvează")
}

export default function AlimentModal({
    title, form, error, onFormChange, onSave, onClose, saveLabel = 'Salvează',
}: AlimentModalProps) {
    return (
        // Overlay-ul — click pe fundal inchide modalul
        <div className="modal-overlay" onClick={onClose}>
            {/* Cutia modala — stopPropagation previne inchiderea accidentala */}
            <div className="modal modal--wide" onClick={e => e.stopPropagation()}>

                {/* Header: titlul + butonul X de inchidere */}
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                {/* Corpul modalului — formularul de date */}
                <div className="modal-body">
                    {/* Mesajul de eroare — apare doar daca exista */}
                    {error && <div className="form-error">{error}</div>}

                    {/* Randul 1: Nume (flex 2) + Categorie (flex 1) */}
                    <div className="form-row-2">
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Nume aliment <span className="req">*</span></label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="ex: Măr, Piept de pui..."
                                value={form.nume}
                                // Spread operator (...form) pastreaza celelalte campuri neschimbate
                                onChange={e => onFormChange({ ...form, nume: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Categorie</label>
                            <CustomSelect
                                value={form.categorie}
                                onChange={val => onFormChange({ ...form, categorie: val as Categorie })}
                                options={categorieOptions}
                                variant="form" // Varianta pentru formulare (mai mare decat "default")
                            />
                        </div>
                    </div>

                    {/* Separator sectiune valorile nutritionale */}
                    <div className="ga-section-label">
                        Valori nutriționale <span className="ga-per">per 100g</span>
                    </div>

                    {/* Randul 2: Calorii + Proteine + Carbohidrati + Grasimi */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Calorii <span className="ga-unit">(kcal)</span></label>
                            <input
                                className="form-input"
                                type="number"
                                min={0}
                                step={1}
                                value={form.calorii}
                                onChange={e => onFormChange({ ...form, calorii: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        {/* Refolosim componenta NutrientInput pentru celelalte 3 macronutriente */}
                        <NutrientInput label="Proteine" value={form.proteine} onChange={v => onFormChange({ ...form, proteine: v })} />
                        <NutrientInput label="Carbohidrați" value={form.carbohidrati} onChange={v => onFormChange({ ...form, carbohidrati: v })} />
                        <NutrientInput label="Grăsimi" value={form.grasimi} onChange={v => onFormChange({ ...form, grasimi: v })} />
                    </div>
                </div>

                {/* Footer: butoanele Anuleaza si Salveaza */}
                <div className="modal-footer">
                    <button className="btn-ghost" onClick={onClose}>Anulează</button>
                    <button className="btn-primary" onClick={onSave}>
                        <FontAwesomeIcon icon={faCheck} style={{ width: 14, height: 14 }} />
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
