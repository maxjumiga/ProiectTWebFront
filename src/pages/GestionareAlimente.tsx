import { useState, useMemo } from 'react';
import type { Aliment, Categorie } from '../types';
import CustomSelect from '../components/CustomSelect';
import './GestionareAlimente.css';

// ── Helpers ──────────────────────────────────────────────────────
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const emptyForm = (): Omit<Aliment, 'id'> => ({
    nume: '',
    categorie: 'altele',
    calorii: 0,
    proteine: 0,
    carbohidrati: 0,
    grasimi: 0,
});

// ── Option lists ──────────────────────────────────────────────────
const categorieOptions: { value: string; label: string }[] = [
    { value: 'fructe', label: 'Fructe' },
    { value: 'legume', label: 'Legume' },
    { value: 'carne', label: 'Carne' },
    { value: 'lactate', label: 'Lactate' },
    { value: 'cereale', label: 'Cereale' },
    { value: 'bauturi', label: 'Băuturi' },
    { value: 'altele', label: 'Altele' },
];

const categorieFilterOptions = [
    { value: 'all', label: 'Toate categoriile' },
    ...categorieOptions,
];

const categorieLabel: Record<Categorie, string> = {
    fructe: 'Fructe',
    legume: 'Legume',
    carne: 'Carne',
    lactate: 'Lactate',
    cereale: 'Cereale',
    bauturi: 'Băuturi',
    altele: 'Altele',
};

const categorieColorClass: Record<Categorie, string> = {
    fructe: 'cat-fructe',
    legume: 'cat-legume',
    carne: 'cat-carne',
    lactate: 'cat-lactate',
    cereale: 'cat-cereale',
    bauturi: 'cat-bauturi',
    altele: 'cat-altele',
};

// ── Component ─────────────────────────────────────────────────────
export default function GestionareAlimente() {
    const [alimente, setAlimente] = useState<Aliment[]>([]);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');

    // Add modal
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState(emptyForm());
    const [addError, setAddError] = useState('');

    // Edit modal
    const [editTarget, setEditTarget] = useState<Aliment | null>(null);
    const [editForm, setEditForm] = useState(emptyForm());
    const [editError, setEditError] = useState('');

    // Delete confirmation
    const [deleteId, setDeleteId] = useState<string | null>(null);

    /* ── filtered list ── */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return alimente.filter(a => {
            const matchSearch = !q || a.nume.toLowerCase().includes(q);
            const matchCat = filterCat === 'all' || a.categorie === filterCat;
            return matchSearch && matchCat;
        });
    }, [alimente, search, filterCat]);

    /* ── validate form ── */
    function validateForm(form: Omit<Aliment, 'id'>): string {
        if (!form.nume.trim()) return 'Numele alimentului este obligatoriu.';
        if (form.calorii < 0 || form.proteine < 0 || form.carbohidrati < 0 || form.grasimi < 0)
            return 'Valorile nutriționale nu pot fi negative.';
        return '';
    }

    /* ── add ── */
    function handleAdd() {
        const err = validateForm(addForm);
        if (err) { setAddError(err); return; }
        setAlimente(prev => [{ ...addForm, id: generateId() }, ...prev]);
        setShowAdd(false);
        setAddForm(emptyForm());
        setAddError('');
    }

    /* ── open edit ── */
    function openEdit(a: Aliment) {
        setEditTarget(a);
        setEditForm({ nume: a.nume, categorie: a.categorie, calorii: a.calorii, proteine: a.proteine, carbohidrati: a.carbohidrati, grasimi: a.grasimi });
        setEditError('');
    }

    /* ── save edit ── */
    function handleEdit() {
        if (!editTarget) return;
        const err = validateForm(editForm);
        if (err) { setEditError(err); return; }
        setAlimente(prev => prev.map(a => a.id === editTarget.id ? { ...editForm, id: a.id } : a));
        setEditTarget(null);
        setEditError('');
    }

    /* ── delete ── */
    function confirmDelete() {
        if (deleteId) {
            setAlimente(prev => prev.filter(a => a.id !== deleteId));
            setDeleteId(null);
        }
    }

    /* ── Shared nutrient input ── */
    function NutrientInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
        return (
            <div className="form-group">
                <label>{label} <span className="ga-unit">(g/100g)</span></label>
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

    return (
        <div className="ga">
            {/* ── Toolbar ── */}
            <div className="um-toolbar">
                <div className="um-search-wrap">
                    <svg className="um-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        className="um-search"
                        type="text"
                        placeholder="Caută aliment după nume..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="um-search-clear" onClick={() => setSearch('')} title="Șterge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    )}
                </div>

                <div className="um-filters">
                    <CustomSelect
                        value={filterCat}
                        onChange={setFilterCat}
                        options={categorieFilterOptions}
                        variant="default"
                    />
                </div>

                <button className="btn-primary" onClick={() => { setShowAdd(true); setAddForm(emptyForm()); setAddError(''); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Adaugă Aliment
                </button>
            </div>

            {/* ── Count ── */}
            <p className="um-count">
                {filtered.length === alimente.length
                    ? `${alimente.length} alimente în bază`
                    : `${filtered.length} din ${alimente.length} alimente`}
            </p>

            {/* ── Table ── */}
            <div className="um-card">
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Aliment</th>
                                <th>Categorie</th>
                                <th>Calorii</th>
                                <th>Proteine</th>
                                <th>Carbohidrați</th>
                                <th>Grăsimi</th>
                                <th style={{ textAlign: 'right' }}>Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? null : (
                                filtered.map(a => (
                                    <tr key={a.id}>
                                        <td>
                                            <div className="ga-name-cell">
                                                <div className={`ga-avatar ${categorieColorClass[a.categorie]}`}>
                                                    {a.nume.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="user-name">{a.nume}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ga-badge-cat ${categorieColorClass[a.categorie]}`}>
                                                {categorieLabel[a.categorie]}
                                            </span>
                                        </td>
                                        <td className="ga-num-cell">
                                            <span className="ga-kcal">{a.calorii}</span>
                                            <span className="ga-unit-sm">kcal</span>
                                        </td>
                                        <td className="ga-num-cell">
                                            <span>{a.proteine}g</span>
                                        </td>
                                        <td className="ga-num-cell">
                                            <span>{a.carbohidrati}g</span>
                                        </td>
                                        <td className="ga-num-cell">
                                            <span>{a.grasimi}g</span>
                                        </td>
                                        <td>
                                            <div className="um-actions">
                                                <button
                                                    className="btn-edit-sm"
                                                    onClick={() => openEdit(a)}
                                                    title="Editează aliment"
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                    Editează
                                                </button>
                                                <button
                                                    className="btn-danger-sm"
                                                    onClick={() => setDeleteId(a.id)}
                                                    title="Șterge aliment"
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                                                    </svg>
                                                    Șterge
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Add Modal ── */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Adaugă Aliment Nou</h3>
                            <button className="modal-close" onClick={() => setShowAdd(false)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            {addError && <div className="form-error">{addError}</div>}
                            <div className="form-row-2">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Nume aliment <span className="req">*</span></label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        placeholder="ex: Măr, Piept de pui..."
                                        value={addForm.nume}
                                        onChange={e => setAddForm(f => ({ ...f, nume: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Categorie</label>
                                    <CustomSelect
                                        value={addForm.categorie}
                                        onChange={val => setAddForm(f => ({ ...f, categorie: val as Categorie }))}
                                        options={categorieOptions}
                                        variant="form"
                                    />
                                </div>
                            </div>
                            <div className="ga-section-label">Valori nutriționale <span className="ga-per">per 100g</span></div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Calorii <span className="ga-unit">(kcal)</span></label>
                                    <input className="form-input" type="number" min={0} step={1} value={addForm.calorii} onChange={e => setAddForm(f => ({ ...f, calorii: parseFloat(e.target.value) || 0 }))} />
                                </div>
                                <NutrientInput label="Proteine" value={addForm.proteine} onChange={v => setAddForm(f => ({ ...f, proteine: v }))} />
                                <NutrientInput label="Carbohidrați" value={addForm.carbohidrati} onChange={v => setAddForm(f => ({ ...f, carbohidrati: v }))} />
                                <NutrientInput label="Grăsimi" value={addForm.grasimi} onChange={v => setAddForm(f => ({ ...f, grasimi: v }))} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Anulează</button>
                            <button className="btn-primary" onClick={handleAdd}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Salvează
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Modal ── */}
            {editTarget && (
                <div className="modal-overlay" onClick={() => setEditTarget(null)}>
                    <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Editează Aliment</h3>
                            <button className="modal-close" onClick={() => setEditTarget(null)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            {editError && <div className="form-error">{editError}</div>}
                            <div className="form-row-2">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Nume aliment <span className="req">*</span></label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={editForm.nume}
                                        onChange={e => setEditForm(f => ({ ...f, nume: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Categorie</label>
                                    <CustomSelect
                                        value={editForm.categorie}
                                        onChange={val => setEditForm(f => ({ ...f, categorie: val as Categorie }))}
                                        options={categorieOptions}
                                        variant="form"
                                    />
                                </div>
                            </div>
                            <div className="ga-section-label">Valori nutriționale <span className="ga-per">per 100g</span></div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Calorii <span className="ga-unit">(kcal)</span></label>
                                    <input className="form-input" type="number" min={0} step={1} value={editForm.calorii} onChange={e => setEditForm(f => ({ ...f, calorii: parseFloat(e.target.value) || 0 }))} />
                                </div>
                                <NutrientInput label="Proteine" value={editForm.proteine} onChange={v => setEditForm(f => ({ ...f, proteine: v }))} />
                                <NutrientInput label="Carbohidrați" value={editForm.carbohidrati} onChange={v => setEditForm(f => ({ ...f, carbohidrati: v }))} />
                                <NutrientInput label="Grăsimi" value={editForm.grasimi} onChange={v => setEditForm(f => ({ ...f, grasimi: v }))} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-ghost" onClick={() => setEditTarget(null)}>Anulează</button>
                            <button className="btn-primary" onClick={handleEdit}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Salvează modificările
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete confirmation ── */}
            {deleteId && (
                <div className="modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirmare ștergere</h3>
                            <button className="modal-close" onClick={() => setDeleteId(null)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="confirm-text">
                                Ești sigur că vrei să ștergi alimentul <strong>{alimente.find(a => a.id === deleteId)?.nume}</strong>? Această acțiune nu poate fi anulată.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-ghost" onClick={() => setDeleteId(null)}>Anulează</button>
                            <button className="btn-danger" onClick={confirmDelete}>Șterge</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
