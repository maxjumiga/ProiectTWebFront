// ============================================================
// pages/exercises/ExercisesManagement.tsx — Pagina gestionare exercitii
// Permite administratorului sa:
//   - Caute exercitii dupa nume sau descriere
//   - Filtreze dupa grupa musculara (piept, spate, picioare etc.)
//   - Adauge un exercitiu nou (cu modal + validare)
//   - Editeze un exercitiu existent (modal pre-completat)
//   - Stearga un exercitiu (cu confirmare prin modal)
// Cautarea functioneaza atat pe nume CAT SI pe descriere.
// Starea locala simuleaza o baza de date in-memory (porneste goala).
// ============================================================

import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Exercitiu } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import CustomSelect from '../../components/CustomSelect';
import ExercitiiTable from '../../features/exercises/ExercisesTable';
import ExercitiiModal from '../../features/exercises/ExercisesModal';
import {
    grupMuscularFilterOptions,
    emptyExercitiiForm,
    validateExercitiiForm,
    generateId,
    type ExercitiiForm,
} from '../../features/exercises/exercisesConstants';
import './ExercisesManagement.css';

export default function GestionareExercitii() {
    // Lista completa de exercitii (in-memory, porneste goala)
    const [exercitii, setExercitii] = useState<Exercitiu[]>([]);

    // Textul de cautare si filtrul de grupa musculara activ
    const [search, setSearch] = useState('');
    const [filterGrup, setFilterGrup] = useState('all'); // 'all' = fara filtru

    // --- Starea modalului de adaugare ---
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState<ExercitiiForm>(emptyExercitiiForm());
    const [addError, setAddError] = useState('');

    // --- Starea modalului de editare ---
    const [editTarget, setEditTarget] = useState<Exercitiu | null>(null); // null = modal inchis
    const [editForm, setEditForm] = useState<ExercitiiForm>(emptyExercitiiForm());
    const [editError, setEditError] = useState('');

    // --- Starea confirmarii de stergere ---
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Lista filtrata — recalculata automat la orice modificare a dependintelor
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return exercitii.filter(e =>
            // Cautarea functioneaza in AMBELE campuri: nume SI descriere
            (!q || e.nume.toLowerCase().includes(q) || e.descriere.toLowerCase().includes(q)) &&
            (filterGrup === 'all' || e.grupMuscular === filterGrup) // Filtrul de grupa musculara
        );
    }, [exercitii, search, filterGrup]);

    // Valideaza si salveaza un exercitiu nou la inceputul listei
    function handleAdd() {
        const err = validateExercitiiForm(addForm);
        if (err) { setAddError(err); return; }
        setExercitii(prev => [{ ...addForm, id: generateId() }, ...prev]); // Adauga la inceput
        setShowAdd(false);
        setAddForm(emptyExercitiiForm()); // Reseteaza pentru urmatoarea utilizare
        setAddError('');
    }

    // Pregateste modalul de editare cu datele exercitiului selectat
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

    // Valideaza si salveaza modificarile unui exercitiu existent
    function handleEdit() {
        if (!editTarget) return;
        const err = validateExercitiiForm(editForm);
        if (err) { setEditError(err); return; }
        // Inlocuieste exercitiul vechi cu datele noi, pastrand ID-ul original
        setExercitii(prev => prev.map(e => e.id === editTarget.id ? { ...editForm, id: e.id } : e));
        setEditTarget(null); // Inchide modalul
        setEditError('');
    }

    // Sterge exercitiul cu ID-ul din deleteId
    function handleDelete() {
        if (deleteId) {
            setExercitii(prev => prev.filter(e => e.id !== deleteId));
            setDeleteId(null); // Inchide modalul de confirmare
        }
    }

    return (
        <div className="ga">

            {/* Toolbar: cautare + filtru grupa musculara + buton adaugare */}
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Caută exercițiu după nume..." />
                <div className="um-filters">
                    {/* Filtrul de grupa musculara — include "Toate grupele" */}
                    <CustomSelect value={filterGrup} onChange={setFilterGrup} options={grupMuscularFilterOptions} variant="default" />
                </div>
                {/* Butonul de adaugare — reseteaza formularul si deschide modalul */}
                <button className="btn-primary" onClick={() => { setShowAdd(true); setAddForm(emptyExercitiiForm()); setAddError(''); }}>
                    <FontAwesomeIcon icon={faPlus} style={{ width: 14, height: 14 }} />
                    Adaugă Exercițiu
                </button>
            </div>

            {/* Contorul — "X exercitii" sau "X din Y exercitii" cand e filtrat */}
            <p className="um-count">
                {filtered.length === exercitii.length
                    ? `${exercitii.length} exerciții în bază`
                    : `${filtered.length} din ${exercitii.length} exerciții`}
            </p>

            {/* Tabelul cu lista de exercitii filtrate */}
            <ExercitiiTable
                filtered={filtered}
                onEdit={openEdit}
                onDelete={setDeleteId}
            />

            {/* Modalul de adaugare — randat conditional */}
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

            {/* Modalul de editare — randat conditional cand editTarget nu e null */}
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

            {/* Modalul de confirmare stergere */}
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
