// AlimentModal — modal reutilizabil pentru adăugare și editare aliment
import type { Categorie } from '../../types';
import CustomSelect from '../../components/CustomSelect';
import { categorieOptions, type AlimentForm } from './alimenteConstants';

interface NutrientInputProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
}

function NutrientInput({ label, value, onChange }: NutrientInputProps) {
    return (
        <div className="form-group">
            <label>{label} <span className="ga-unit">(g/100g)</span></label>
            <input
                className="form-input"
                type="number"
                min={0}
                step={0.1}
                value={value}
                onChange={e => onChange(parseFloat(e.target.value) || 0)}
            />
        </div>
    );
}

interface AlimentModalProps {
    title: string;
    form: AlimentForm;
    error: string;
    onFormChange: (form: AlimentForm) => void;
    onSave: () => void;
    onClose: () => void;
    saveLabel?: string;
}

export default function AlimentModal({
    title, form, error, onFormChange, onSave, onClose, saveLabel = 'Salvează',
}: AlimentModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-row-2">
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Nume aliment <span className="req">*</span></label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="ex: Măr, Piept de pui..."
                                value={form.nume}
                                onChange={e => onFormChange({ ...form, nume: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Categorie</label>
                            <CustomSelect
                                value={form.categorie}
                                onChange={val => onFormChange({ ...form, categorie: val as Categorie })}
                                options={categorieOptions}
                                variant="form"
                            />
                        </div>
                    </div>

                    <div className="ga-section-label">
                        Valori nutriționale <span className="ga-per">per 100g</span>
                    </div>

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
                        <NutrientInput label="Proteine" value={form.proteine} onChange={v => onFormChange({ ...form, proteine: v })} />
                        <NutrientInput label="Carbohidrați" value={form.carbohidrati} onChange={v => onFormChange({ ...form, carbohidrati: v })} />
                        <NutrientInput label="Grăsimi" value={form.grasimi} onChange={v => onFormChange({ ...form, grasimi: v })} />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-ghost" onClick={onClose}>Anulează</button>
                    <button className="btn-primary" onClick={onSave}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
