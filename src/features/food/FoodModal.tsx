import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { type AlimentForm } from './foodConstants';

interface NumericInputProps {
    label: string;
    value: number;
    unit?: string;
    step?: number;
    onChange: (v: number) => void;
}

function NumericInput({ label, value, unit = 'g/100g', step = 0.1, onChange }: NumericInputProps) {
    const [inputValue, setInputValue] = useState(value.toString());

    // Sync input value if parent value changes externally (e.g. loading a different target)
    useEffect(() => {
        if (parseFloat(inputValue) !== value) {
            setInputValue(value.toString());
        }
    }, [value]);

    const handleChange = (valStr: string) => {
        setInputValue(valStr);
        const parsed = parseFloat(valStr);
        onChange(isNaN(parsed) ? 0 : parsed);
    };

    const handleBlur = () => {
        if (inputValue.trim() === '' || isNaN(parseFloat(inputValue))) {
            setInputValue('0');
            onChange(0);
        } else {
            const parsed = parseFloat(inputValue);
            setInputValue(parsed.toString());
            onChange(parsed);
        }
    };

    return (
        <div className="form-group">
            <label>{label} <span className="ga-unit">({unit})</span></label>
            <input
                className="form-input"
                type="number"
                min={0}
                step={step}
                value={inputValue}
                onChange={e => handleChange(e.target.value)}
                onBlur={handleBlur}
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
                        <NumericInput
                            label="Calories"
                            value={form.calorii}
                            unit="kcal"
                            step={1}
                            onChange={v => onFormChange({ ...form, calorii: v })}
                        />
                        <NumericInput label="Protein" value={form.proteine} onChange={v => onFormChange({ ...form, proteine: v })} />
                        <NumericInput label="Carbs" value={form.carbohidrati} onChange={v => onFormChange({ ...form, carbohidrati: v })} />
                        <NumericInput label="Fats" value={form.grasimi} onChange={v => onFormChange({ ...form, grasimi: v })} />
                        <NumericInput label="Fiber" value={form.fibre} onChange={v => onFormChange({ ...form, fibre: v })} />
                        <NumericInput label="Vitamin C" value={form.vitaminaC} unit="mg/100g" onChange={v => onFormChange({ ...form, vitaminaC: v })} />
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
