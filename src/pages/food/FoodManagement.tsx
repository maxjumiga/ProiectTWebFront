import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Aliment } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import FoodTable from '../../features/food/FoodTable';
import FoodModal from '../../features/food/FoodModal';
import {
    emptyAlimentForm,
    validateAlimentForm,
    type AlimentForm,
} from '../../features/food/foodConstants';
import {
    createAdminFood,
    deleteAdminFood,
    getAdminFoods,
    updateAdminFood,
} from '../../services/adminApi';
import './FoodManagement.css';

export default function FoodManagement() {
    const [alimente, setAlimente] = useState<Aliment[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [requestError, setRequestError] = useState('');

    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState<AlimentForm>(emptyAlimentForm());
    const [addError, setAddError] = useState('');

    const [editTarget, setEditTarget] = useState<Aliment | null>(null);
    const [editForm, setEditForm] = useState<AlimentForm>(emptyAlimentForm());
    const [editError, setEditError] = useState('');

    const [deleteId, setDeleteId] = useState<number | null>(null);

    async function loadFoods() {
        try {
            setLoading(true);
            setRequestError('');
            setAlimente(await getAdminFoods());
        } catch (error) {
            setRequestError(error instanceof Error ? error.message : 'Failed to load foods.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFoods();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return alimente.filter(a => !q || a.nume.toLowerCase().includes(q));
    }, [alimente, search]);

    async function handleAdd() {
        const err = validateAlimentForm(addForm);
        if (err) {
            setAddError(err);
            return;
        }

        try {
            await createAdminFood(addForm);
            setShowAdd(false);
            setAddForm(emptyAlimentForm());
            setAddError('');
            await loadFoods();
        } catch (error) {
            setAddError(error instanceof Error ? error.message : 'Failed to create food.');
        }
    }

    function openEdit(a: Aliment) {
        setEditTarget(a);
        setEditForm({
            nume: a.nume,
            calorii: a.calorii,
            proteine: a.proteine,
            carbohidrati: a.carbohidrati,
            grasimi: a.grasimi,
            fibre: a.fibre,
            vitaminaC: a.vitaminaC,
        });
        setEditError('');
    }

    async function handleEdit() {
        if (!editTarget) return;

        const err = validateAlimentForm(editForm);
        if (err) {
            setEditError(err);
            return;
        }

        try {
            await updateAdminFood(editTarget.id, editForm);
            setEditTarget(null);
            setEditError('');
            await loadFoods();
        } catch (error) {
            setEditError(error instanceof Error ? error.message : 'Failed to update food.');
        }
    }

    async function handleDelete() {
        if (!deleteId) return;

        try {
            await deleteAdminFood(deleteId);
            setDeleteId(null);
            await loadFoods();
        } catch (error) {
            setRequestError(error instanceof Error ? error.message : 'Failed to delete food.');
        }
    }

    return (
        <div className="ga">
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Search food by name..." />
                <button className="btn-primary" onClick={() => { setShowAdd(true); setAddForm(emptyAlimentForm()); setAddError(''); }}>
                    <FontAwesomeIcon icon={faPlus} style={{ width: 14, height: 14 }} />
                    Add Food
                </button>
            </div>

            {requestError && <div className="form-error" style={{ marginBottom: '1rem' }}>{requestError}</div>}

            <p className="um-count">
                {filtered.length === alimente.length
                    ? `${alimente.length} foods in database`
                    : `${filtered.length} of ${alimente.length} foods`}
            </p>

            {loading ? (
                <div className="um-card"><div className="um-empty"><span>Loading foods...</span></div></div>
            ) : (
                <FoodTable
                    filtered={filtered}
                    onEdit={openEdit}
                    onDelete={setDeleteId}
                />
            )}

            {showAdd && (
                <FoodModal
                    title="Add New Food"
                    form={addForm}
                    error={addError}
                    onFormChange={setAddForm}
                    onSave={handleAdd}
                    onClose={() => setShowAdd(false)}
                    saveLabel="Add"
                />
            )}

            {editTarget && (
                <FoodModal
                    title="Edit Food"
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
                    itemName={alimente.find(a => a.id === deleteId)?.nume ?? ''}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
