// GestionareAlimente — pagina de gestionare bază de date cu alimente
import { useState, useMemo } from 'react';
import type { Aliment } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import CustomSelect from '../../components/CustomSelect';
import AlimenteTable from '../../features/alimente/AlimenteTable';
import AlimentModal from '../../features/alimente/AlimentModal';
import {
    categorieFilterOptions,
    emptyAlimentForm,
    validateAlimentForm,
    generateId,
    type AlimentForm,
} from '../../features/alimente/alimenteConstants';
import '../GestionareAlimente.css';

export default function GestionareAlimente() {
    const [alimente, setAlimente] = useState<Aliment[]>([]);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');

    // Stare modal Adaugă
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState<AlimentForm>(emptyAlimentForm());
    const [addError, setAddError] = useState('');

    // Stare modal Editează
    const [editTarget, setEditTarget] = useState<Aliment | null>(null);
    const [editForm, setEditForm] = useState<AlimentForm>(emptyAlimentForm());
    const [editError, setEditError] = useState('');

    // Stare confirmare ștergere
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return alimente.filter(a =>
            (!q || a.nume.toLowerCase().includes(q)) &&
            (filterCat === 'all' || a.categorie === filterCat)
        );
    }, [alimente, search, filterCat]);

    function handleAdd() {
        const err = validateAlimentForm(addForm);
        if (err) { setAddError(err); return; }
        setAlimente(prev => [{ ...addForm, id: generateId() }, ...prev]);
        setShowAdd(false);
        setAddForm(emptyAlimentForm());
        setAddError('');
    }

    function openEdit(a: Aliment) {
        setEditTarget(a);
        setEditForm({ nume: a.nume, categorie: a.categorie, calorii: a.calorii, proteine: a.proteine, carbohidrati: a.carbohidrati, grasimi: a.grasimi });
        setEditError('');
    }

    function handleEdit() {
        if (!editTarget) return;
        const err = validateAlimentForm(editForm);
        if (err) { setEditError(err); return; }
        setAlimente(prev => prev.map(a => a.id === editTarget.id ? { ...editForm, id: a.id } : a));
        setEditTarget(null);
        setEditError('');
    }

    function handleDelete() {
        if (deleteId) {
            setAlimente(prev => prev.filter(a => a.id !== deleteId));
            setDeleteId(null);
        }
    }

    return (
        <div className="ga">
            {/* Toolbar */}
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Caută aliment după nume..." />
                <div className="um-filters">
                    <CustomSelect value={filterCat} onChange={setFilterCat} options={categorieFilterOptions} variant="default" />
                </div>
                <button className="btn-primary" onClick={() => { setShowAdd(true); setAddForm(emptyAlimentForm()); setAddError(''); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Adaugă Aliment
                </button>
            </div>

            {/* Contor */}
            <p className="um-count">
                {filtered.length === alimente.length
                    ? `${alimente.length} alimente în bază`
                    : `${filtered.length} din ${alimente.length} alimente`}
            </p>

            {/* Tabel */}
            <AlimenteTable
                alimente={alimente}
                filtered={filtered}
                onEdit={openEdit}
                onDelete={setDeleteId}
            />

            {/* Modal Adaugă */}
            {showAdd && (
                <AlimentModal
                    title="Adaugă Aliment Nou"
                    form={addForm}
                    error={addError}
                    onFormChange={setAddForm}
                    onSave={handleAdd}
                    onClose={() => setShowAdd(false)}
                    saveLabel="Adaugă"
                />
            )}

            {/* Modal Editează */}
            {editTarget && (
                <AlimentModal
                    title="Editează Aliment"
                    form={editForm}
                    error={editError}
                    onFormChange={setEditForm}
                    onSave={handleEdit}
                    onClose={() => setEditTarget(null)}
                    saveLabel="Salvează modificările"
                />
            )}

            {/* Confirmare ștergere */}
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
