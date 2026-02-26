// GestionareExercitii — pagina de gestionare bază de date cu exerciții
import { useState, useMemo } from 'react';
import type { Exercitiu } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import CustomSelect from '../../components/CustomSelect';
import ExercitiiTable from '../../features/exercitii/ExercitiiTable';
import ExercitiiModal from '../../features/exercitii/ExercitiiModal';
import {
    grupMuscularFilterOptions,
    emptyExercitiiForm,
    validateExercitiiForm,
    generateId,
    type ExercitiiForm,
} from '../../features/exercitii/exercitiiConstants';
import './GestionareExercitii.css';

export default function GestionareExercitii() {
    const [exercitii, setExercitii] = useState<Exercitiu[]>([]);
    const [search, setSearch] = useState('');
    const [filterGrup, setFilterGrup] = useState('all');

    // Stare modal Adaugă
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState<ExercitiiForm>(emptyExercitiiForm());
    const [addError, setAddError] = useState('');

    // Stare modal Editează
    const [editTarget, setEditTarget] = useState<Exercitiu | null>(null);
    const [editForm, setEditForm] = useState<ExercitiiForm>(emptyExercitiiForm());
    const [editError, setEditError] = useState('');

    // Stare confirmare ștergere
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return exercitii.filter(e =>
            (!q || e.nume.toLowerCase().includes(q) || e.descriere.toLowerCase().includes(q)) &&
            (filterGrup === 'all' || e.grupMuscular === filterGrup)
        );
    }, [exercitii, search, filterGrup]);

    function handleAdd() {
        const err = validateExercitiiForm(addForm);
        if (err) { setAddError(err); return; }
        setExercitii(prev => [{ ...addForm, id: generateId() }, ...prev]);
        setShowAdd(false);
        setAddForm(emptyExercitiiForm());
        setAddError('');
    }

    function openEdit(ex: Exercitiu) {
        setEditTarget(ex);
        setEditForm({
            nume: ex.nume,
            grupMuscular: ex.grupMuscular,
            dificultate: ex.dificultate,
            descriere: ex.descriere,
            durataMed: ex.durataMed,
        });
        setEditError('');
    }

    function handleEdit() {
        if (!editTarget) return;
        const err = validateExercitiiForm(editForm);
        if (err) { setEditError(err); return; }
        setExercitii(prev => prev.map(e => e.id === editTarget.id ? { ...editForm, id: e.id } : e));
        setEditTarget(null);
        setEditError('');
    }

    function handleDelete() {
        if (deleteId) {
            setExercitii(prev => prev.filter(e => e.id !== deleteId));
            setDeleteId(null);
        }
    }

    return (
        <div className="ga">
            {/* Toolbar */}
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Caută exercițiu după nume..." />
                <div className="um-filters">
                    <CustomSelect value={filterGrup} onChange={setFilterGrup} options={grupMuscularFilterOptions} variant="default" />
                </div>
                <button className="btn-primary" onClick={() => { setShowAdd(true); setAddForm(emptyExercitiiForm()); setAddError(''); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Adaugă Exercițiu
                </button>
            </div>

            {/* Contor */}
            <p className="um-count">
                {filtered.length === exercitii.length
                    ? `${exercitii.length} exerciții în bază`
                    : `${filtered.length} din ${exercitii.length} exerciții`}
            </p>

            {/* Tabel */}
            <ExercitiiTable
                filtered={filtered}
                onEdit={openEdit}
                onDelete={setDeleteId}
            />

            {/* Modal Adaugă */}
            {showAdd && (
                <ExercitiiModal
                    title="Adaugă Exercițiu Nou"
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
                <ExercitiiModal
                    title="Editează Exercițiu"
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
                    itemName={exercitii.find(e => e.id === deleteId)?.nume ?? ''}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
