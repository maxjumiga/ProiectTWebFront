import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Exercitiu } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import CustomSelect from '../../components/CustomSelect';
import ExercisesTable from '../../features/exercises/ExercisesTable';
import ExercisesModal from '../../features/exercises/ExercisesModal';
import {
    grupMuscularFilterOptions,
    emptyExercitiiForm,
    validateExercitiiForm,
    type ExercitiiForm,
} from '../../features/exercises/exercisesConstants';
import {
    createAdminExercise,
    deleteAdminExercise,
    getAdminExercises,
    updateAdminExercise,
} from '../../services/adminApi';
import './ExercisesManagement.css';

export default function ExercisesManagement() {
    const [exercitii, setExercitii] = useState<Exercitiu[]>([]);
    const [search, setSearch] = useState('');
    const [filterGrup, setFilterGrup] = useState('all');
    const [loading, setLoading] = useState(true);
    const [requestError, setRequestError] = useState('');

    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState<ExercitiiForm>(emptyExercitiiForm());
    const [addError, setAddError] = useState('');

    const [editTarget, setEditTarget] = useState<Exercitiu | null>(null);
    const [editForm, setEditForm] = useState<ExercitiiForm>(emptyExercitiiForm());
    const [editError, setEditError] = useState('');

    const [deleteId, setDeleteId] = useState<number | null>(null);

    async function loadExercises() {
        try {
            setLoading(true);
            setRequestError('');
            setExercitii(await getAdminExercises());
        } catch (error) {
            setRequestError(error instanceof Error ? error.message : 'Failed to load exercises.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadExercises();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return exercitii.filter(e =>
            (!q || e.nume.toLowerCase().includes(q) || e.grupaSecundara.toLowerCase().includes(q)) &&
            (filterGrup === 'all' || e.grupMuscular === filterGrup)
        );
    }, [exercitii, search, filterGrup]);

    async function handleAdd() {
        const err = validateExercitiiForm(addForm);
        if (err) {
            setAddError(err);
            return;
        }

        try {
            await createAdminExercise(addForm);
            setShowAdd(false);
            setAddForm(emptyExercitiiForm());
            setAddError('');
            await loadExercises();
        } catch (error) {
            setAddError(error instanceof Error ? error.message : 'Failed to create exercise.');
        }
    }

    function openEdit(ex: Exercitiu) {
        setEditTarget(ex);
        setEditForm({
            nume: ex.nume,
            grupMuscular: ex.grupMuscular,
            grupaSecundara: ex.grupaSecundara,
            dificultate: ex.dificultate,
            costOboseala: ex.costOboseala,
        });
        setEditError('');
    }

    async function handleEdit() {
        if (!editTarget) return;

        const err = validateExercitiiForm(editForm);
        if (err) {
            setEditError(err);
            return;
        }

        try {
            await updateAdminExercise(editTarget.id, editForm);
            setEditTarget(null);
            setEditError('');
            await loadExercises();
        } catch (error) {
            setEditError(error instanceof Error ? error.message : 'Failed to update exercise.');
        }
    }

    async function handleDelete() {
        if (!deleteId) return;

        try {
            await deleteAdminExercise(deleteId);
            setDeleteId(null);
            await loadExercises();
        } catch (error) {
            setRequestError(error instanceof Error ? error.message : 'Failed to delete exercise.');
        }
    }

    return (
        <div className="ga">
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Search exercise by name..." />
                <div className="um-filters">
                    <CustomSelect value={filterGrup} onChange={setFilterGrup} options={grupMuscularFilterOptions} variant="default" />
                </div>
                <button className="btn-primary" onClick={() => { setShowAdd(true); setAddForm(emptyExercitiiForm()); setAddError(''); }}>
                    <FontAwesomeIcon icon={faPlus} style={{ width: 14, height: 14 }} />
                    Add Exercise
                </button>
            </div>

            {requestError && <div className="form-error" style={{ marginBottom: '1rem' }}>{requestError}</div>}

            <p className="um-count">
                {filtered.length === exercitii.length
                    ? `${exercitii.length} exercises in database`
                    : `${filtered.length} of ${exercitii.length} exercises`}
            </p>

            {loading ? (
                <div className="um-card"><div className="um-empty"><span>Loading exercises...</span></div></div>
            ) : (
                <ExercisesTable
                    filtered={filtered}
                    onEdit={openEdit}
                    onDelete={setDeleteId}
                />
            )}

            {showAdd && (
                <ExercisesModal
                    title="Add New Exercise"
                    form={addForm}
                    error={addError}
                    onFormChange={setAddForm}
                    onSave={handleAdd}
                    onClose={() => setShowAdd(false)}
                    saveLabel="Add"
                />
            )}

            {editTarget && (
                <ExercisesModal
                    title="Edit Exercise"
                    form={editForm}
                    error={editError}
                    onFormChange={setEditForm}
                    onSave={handleEdit}
                    onClose={() => setEditTarget(null)}
                    saveLabel="Save changes"
                />
            )}

            {deleteId && (
                <ConfirmDeleteModal
                    itemName={exercitii.find(e => e.id === deleteId)?.nume ?? ''}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
