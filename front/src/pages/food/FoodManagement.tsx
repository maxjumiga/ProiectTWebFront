// ============================================================
// pages/food/FoodManagement.tsx — Pagina gestionare alimente
// Permite administratorului sa:
//   - Caute alimente dupa nume
//   - Filtreze dupa categorie (fructe, legume, carne etc.)
//   - Adauge un aliment nou (cu modal + validare)
//   - Editeze un aliment existent (modal pre-completat)
//   - Stearga un aliment (cu confirmare prin modal)
// Starea locala (useState) simuleaza o baza de date in-memory.
// Lista porneste goala — alimentele se adauga prin interfata.
// ============================================================

import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Aliment } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import CustomSelect from '../../components/CustomSelect';
import FoodTable from '../../features/food/FoodTable';
import FoodModal from '../../features/food/FoodModal';
import {
    categorieFilterOptions,
    emptyAlimentForm,
    validateAlimentForm,
    generateId,
    type AlimentForm,
} from '../../features/food/foodConstants';
import './FoodManagement.css';

export default function FoodManagement() {
    // Lista completa de alimente (in-memory, porneste goala)
    const [alimente, setAlimente] = useState<Aliment[]>([]);

    // Textul de cautare si filtrul de categorie activ
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all'); // 'all' = fara filtru

    // --- Starea modalului de adaugare ---
    const [showAdd, setShowAdd] = useState(false);          // Deschis/inchis
    const [addForm, setAddForm] = useState<AlimentForm>(emptyAlimentForm()); // Datele formularului
    const [addError, setAddError] = useState('');           // Mesajul de eroare

    // --- Starea modalului de editare ---
    const [editTarget, setEditTarget] = useState<Aliment | null>(null); // Alimentul editat (null = inchis)
    const [editForm, setEditForm] = useState<AlimentForm>(emptyAlimentForm()); // Datele formularului
    const [editError, setEditError] = useState('');

    // --- Starea confirmarii de stergere ---
    const [deleteId, setDeleteId] = useState<string | null>(null); // ID-ul de sters (null = inchis)

    // Lista filtrata — recalculata automat cand se schimba dependintele
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return alimente.filter(a =>
            (!q || a.nume.toLowerCase().includes(q)) && // Filtru text: cautare in nume
            (filterCat === 'all' || a.categorie === filterCat) // Filtru categorie
        );
    }, [alimente, search, filterCat]);

    // Valideaza si salveaza un aliment nou la inceputul listei
    function handleAdd() {
        const err = validateAlimentForm(addForm);
        if (err) { setAddError(err); return; } // Opreste salvarea daca e eroare
        setAlimente(prev => [{ ...addForm, id: generateId() }, ...prev]); // Adauga la inceput
        setShowAdd(false);
        setAddForm(emptyAlimentForm()); // Reseteaza formularul pentru urmatoarea utilizare
        setAddError('');
    }

    // Pregateste modalul de editare cu datele alimentului selectat
    function openEdit(a: Aliment) {
        setEditTarget(a); // Retine referinta la alimentul editat
        setEditForm({ // Copiaza datele in formular
            nume: a.nume,
            categorie: a.categorie,
            calorii: a.calorii,
            proteine: a.proteine,
            carbohidrati: a.carbohidrati,
            grasimi: a.grasimi,
        });
        setEditError('');
    }

    // Valideaza si salveaza modificarile unui aliment existent
    function handleEdit() {
        if (!editTarget) return;
        const err = validateAlimentForm(editForm);
        if (err) { setEditError(err); return; }
        // Inlocuieste alimentul vechi cu datele noi, pastrand ID-ul original
        setAlimente(prev => prev.map(a => a.id === editTarget.id ? { ...editForm, id: a.id } : a));
        setEditTarget(null); // Inchide modalul
        setEditError('');
    }

    // Sterge alimentul cu ID-ul din deleteId
    function handleDelete() {
        if (deleteId) {
            setAlimente(prev => prev.filter(a => a.id !== deleteId));
            setDeleteId(null); // Inchide modalul de confirmare
        }
    }

    return (
        <div className="ga">

            {/* Toolbar: cautare + filtru categorie + buton adaugare */}
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Search food by name..." />
                <div className="um-filters">
                    {/* Filtrul de categorie — include "Toate categoriile" */}
                    <CustomSelect value={filterCat} onChange={setFilterCat} options={categorieFilterOptions} variant="default" />
                </div>
                {/* Butonul de adaugare — reseteaza formularul si deschide modalul */}
                <button className="btn-primary" onClick={() => { setShowAdd(true); setAddForm(emptyAlimentForm()); setAddError(''); }}>
                    <FontAwesomeIcon icon={faPlus} style={{ width: 14, height: 14 }} />
                    Add Food
                </button>
            </div>

            {/* Contorul — arata "X alimente" sau "X din Y alimente" cand e filtrat */}
            <p className="um-count">
                {filtered.length === alimente.length
                    ? `${alimente.length} foods in database`
                    : `${filtered.length} of ${alimente.length} foods`}
            </p>

            {/* Table with filtered food list */}
            <FoodTable
                alimente={alimente}
                filtered={filtered}
                onEdit={openEdit}
                onDelete={setDeleteId} // Sets the ID to open the confirmation modal
            />

            {/* Add modal — conditional rendering */}
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

            {/* Edit modal — conditional rendering when editTarget is not null */}
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

            {/* Modalul de confirmare stergere — apare cand deleteId nu e null */}
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
