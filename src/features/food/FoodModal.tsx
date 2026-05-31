import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { type AlimentForm } from './foodConstants';

interface NutrientInputProps {
    label: string;
    value: number;
    unit?: string;
    onChange: (v: number) => void;
}

function NutrientInput({ label, value, unit = 'g/100g', onChange }: NutrientInputProps) {
    return (
        <div className="form-group">
            <label>{label} <span className="ga-unit">({unit})</span></label>
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

interface FoodModalProps {
    title: string;
    form: AlimentForm;
    error: string;
    onFormChange: (form: AlimentForm) => void;
    onSave: () => void;
    onClose: () => void;
    saveLabel?: string;
}

export default function FoodModal({
    title, form, error, onFormChange, onSave, onClose, saveLabel = 'Save',
}: FoodModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                <div className="modal-body">
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-row">
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Food name <span className="req">*</span></label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="e.g.: Apple, Chicken breast..."
                                value={form.nume}
                                onChange={e => onFormChange({ ...form, nume: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="ga-section-label">
                        Nutritional values <span className="ga-per">per 100g</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Calories <span className="ga-unit">(kcal)</span></label>
                            <input
                                className="form-input"
                                type="number"
                                min={0}
                                step={1}
                                value={form.calorii}
                                onChange={e => onFormChange({ ...form, calorii: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <NutrientInput label="Protein" value={form.proteine} onChange={v => onFormChange({ ...form, proteine: v })} />
                        <NutrientInput label="Carbs" value={form.carbohidrati} onChange={v => onFormChange({ ...form, carbohidrati: v })} />
                        <NutrientInput label="Fats" value={form.grasimi} onChange={v => onFormChange({ ...form, grasimi: v })} />
                        <NutrientInput label="Fiber" value={form.fibre} onChange={v => onFormChange({ ...form, fibre: v })} />
                        <NutrientInput label="Vitamin C" value={form.vitaminaC} unit="mg/100g" onChange={v => onFormChange({ ...form, vitaminaC: v })} />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={onSave}>
                        <FontAwesomeIcon icon={faCheck} style={{ width: 14, height: 14 }} />
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
