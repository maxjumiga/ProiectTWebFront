// ExercitiiModal — modal reutilizabil pentru adăugare și editare exerciții
import type { GrupMuscular, DificultateExercitiu, ExercitiiForm } from './exercitiiConstants';
import { grupMuscularOptions, dificultateOptions } from './exercitiiConstants';
import CustomSelect from '../../components/CustomSelect';

interface ExercitiiModalProps {
    title: string;
    form: ExercitiiForm;
    error: string;
    onFormChange: (form: ExercitiiForm) => void;
    onSave: () => void;
    onClose: () => void;
    saveLabel?: string;
}

export default function ExercitiiModal({
    title, form, error, onFormChange, onSave, onClose, saveLabel = 'Salvează',
}: ExercitiiModalProps) {
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

                    {/* Rând 1: Nume + Grupă musculară + Dificultate */}
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

                    {/* Durată medie */}
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

                    {/* Descriere */}
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
