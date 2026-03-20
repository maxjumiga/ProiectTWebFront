// ============================================================
// features/exercitii/ExercitiiModal.tsx — Modal adaugare/editare exercitiu
// Componenta reutilizabila pentru ambele operatii (add si edit).
// Formularul contine:
//   - Camp text pentru numele exercitiului (obligatoriu)
//   - Dropdown pentru grupa musculara (CustomSelect)
//   - Dropdown pentru dificultate (CustomSelect)
//   - Input numeric pentru durata medie (minute)
//   - Textarea pentru descriere (optional)
// Validarea se face in GestionareExercitii prin validateExercitiiForm
// ============================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import type { GrupMuscular, DificultateExercitiu, ExercitiiForm } from './exercitiiConstants';
import { grupMuscularOptions, dificultateOptions } from './exercitiiConstants';
import CustomSelect from '../../components/CustomSelect';

// Proprietatile primite de la GestionareExercitii
interface ExercitiiModalProps {
    title: string;                              // Titlul modalului
    form: ExercitiiForm;                        // Datele curente ale formularului
    error: string;                              // Mesajul de eroare (gol = fara eroare)
    onFormChange: (form: ExercitiiForm) => void; // Callback la orice modificare
    onSave: () => void;                         // Callback la salvare
    onClose: () => void;                        // Callback la inchidere
    saveLabel?: string;                         // Textul butonului (default: "Salvează")
}

export default function ExercitiiModal({
    title, form, error, onFormChange, onSave, onClose, saveLabel = 'Salvează',
}: ExercitiiModalProps) {
    return (
        // Overlay — click pe fundal inchide modalul
        <div className="modal-overlay" onClick={onClose}>
            {/* Cutia modala — stopPropagation previne inchiderea accidentala */}
            <div className="modal modal--wide" onClick={e => e.stopPropagation()}>

                {/* Header: titlul + butonul X */}
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                {/* Corpul: formularul */}
                <div className="modal-body">
                    {/* Eroarea de validare — apare doar daca exista */}
                    {error && <div className="form-error">{error}</div>}

                    {/* Randul 1: Numele exercitiului (pe toata latimea) */}
                    <div className="form-row">
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Nume exercițiu <span className="req">*</span></label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="ex: Flotări, Genuflexiuni, Alergare..."
                                value={form.nume}
                                onChange={e => onFormChange({ ...form, nume: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Randul 2: Grupa musculara + Dificultate (2 coloane) */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Grupă musculară</label>
                            <CustomSelect
                                value={form.grupMuscular}
                                onChange={val => onFormChange({ ...form, grupMuscular: val as GrupMuscular })}
                                options={grupMuscularOptions}
                                variant="form"
                            />
                        </div>
                        <div className="form-group">
                            <label>Dificultate</label>
                            <CustomSelect
                                value={form.dificultate}
                                onChange={val => onFormChange({ ...form, dificultate: val as DificultateExercitiu })}
                                options={dificultateOptions}
                                variant="form"
                            />
                        </div>
                    </div>

                    {/* Durata medie in minute */}
                    <div className="form-group">
                        <label>Durată medie <span className="ga-unit">(minute)</span></label>
                        <input
                            className="form-input"
                            type="number"
                            min={0}
                            step={1}
                            placeholder="ex: 30"
                            value={form.durataMed}
                            onChange={e => onFormChange({ ...form, durataMed: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    {/* Descriere — camp text liber, optional */}
                    <div className="form-group">
                        <label>Descriere <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '11px' }}>(opțional)</span></label>
                        <textarea
                            className="form-input ex-textarea"
                            rows={3}
                            placeholder="Descrie tehnica de execuție, mușchii implicați..."
                            value={form.descriere}
                            onChange={e => onFormChange({ ...form, descriere: e.target.value })}
                        />
                    </div>
                </div>

                {/* Footer: Anuleaza + Salveaza */}
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
