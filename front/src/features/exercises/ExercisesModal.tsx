import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import type { CostOboseala, DificultateExercitiu, GrupMuscular } from '../../types';
import {
    costObosealaOptions,
    dificultateOptions,
    grupMuscularOptions,
    type ExercitiiForm,
} from './exercisesConstants';
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

export default function ExercisesModal({
    title, form, error, onFormChange, onSave, onClose, saveLabel = 'Save',
}: ExercitiiModalProps) {
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
                            <label>Exercise name <span className="req">*</span></label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="e.g.: Push-ups, Squats, Running..."
                                value={form.nume}
                                onChange={e => onFormChange({ ...form, nume: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Muscle Group</label>
                            <CustomSelect
                                value={form.grupMuscular}
                                onChange={val => onFormChange({ ...form, grupMuscular: val as GrupMuscular })}
                                options={grupMuscularOptions}
                                variant="form"
                            />
                        </div>
                        <div className="form-group">
                            <label>Difficulty</label>
                            <CustomSelect
                                value={form.dificultate}
                                onChange={val => onFormChange({ ...form, dificultate: val as DificultateExercitiu })}
                                options={dificultateOptions}
                                variant="form"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Secondary muscle group</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="e.g.: Triceps"
                                value={form.grupaSecundara}
                                onChange={e => onFormChange({ ...form, grupaSecundara: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fatigue cost</label>
                            <CustomSelect
                                value={form.costOboseala}
                                onChange={val => onFormChange({ ...form, costOboseala: val as CostOboseala })}
                                options={costObosealaOptions}
                                variant="form"
                            />
                        </div>
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
