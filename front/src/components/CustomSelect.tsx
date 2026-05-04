// ============================================================
// components/CustomSelect.tsx — Dropdown (select) personalizat
// Inlocuieste elementul nativ <select> din browser cu un dropdown
// stilizat complet, care suporta:
//   - culori diferite pe optiuni (colorMap)
//   - variante vizuale: default, inline (in tabel), form (in modal)
//   - inchidere automata la click outside
//   - iconita de check pe optiunea selectata
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import './CustomSelect.css';

// Structura unei optiuni din dropdown
export interface SelectOption {
    value: string;  // Valoarea interna (ex: 'admin')
    label: string;  // Textul afisat utilizatorului (ex: 'Administrator')
}

// Proprietatile acceptate de componenta
interface CustomSelectProps {
    value: string;                     // Valoarea selectata curent
    onChange: (value: string) => void; // Callback apelat la selectarea unei optiuni
    options: SelectOption[];           // Lista de optiuni disponibile
    placeholder?: string;             // Text afisat cand nu e nimic selectat
    variant?: 'default' | 'inline' | 'form'; // Stilul vizual al dropdown-ului
    colorMap?: Record<string, string>; // Map: valoare → clasa CSS de culoare
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Selectează...',
    variant = 'default',
    colorMap,
}: CustomSelectProps) {
    // Starea de deschis/inchis a dropdown-ului
    const [open, setOpen] = useState(false);

    // Referinta la containerul DOM pentru detectia click-ului exterior
    const ref = useRef<HTMLDivElement>(null);

    // Gasim optiunea selectata curent pentru a-i afisa label-ul
    const selected = options.find(o => o.value === value);

    // Clasa de culoare pentru butonul trigger (ex: "admin" → "csel-color--admin")
    const colorKey = colorMap?.[value] ?? '';

    // Efect: inchide dropdown-ul cand utilizatorul da click in afara lui
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        // Adaugam event listener global la montare
        document.addEventListener('mousedown', handleClick);
        // Curatam event listener-ul la demontare (cleanup)
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Selecteaza o optiune si inchide dropdown-ul
    function handleSelect(val: string) {
        onChange(val);
        setOpen(false);
    }

    return (
        <div
            ref={ref}
            // Clasa dinamica: varianta + stare deschis (pentru animatia sagetii)
            className={`csel csel--${variant}${open ? ' csel--open' : ''}`}
        >
            {/* Butonul trigger — deschide/inchide dropdown-ul la click */}
            <button
                type="button"
                className={`csel-trigger${colorKey ? ` csel-color--${colorKey}` : ''}`}
                onClick={() => setOpen(prev => !prev)}
            >
                <span className="csel-label">{selected?.label ?? placeholder}</span>
                {/* Sageata chevron — se roteste 180° cand e deschis prin CSS */}
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className="csel-arrow"
                    style={{ width: 12, height: 12 }}
                />
            </button>

            {/* Lista dropdown — randare conditionala, apare doar cand e deschis */}
            {open && (
                <div className="csel-dropdown">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            // Clasa --active pentru optiunea selectata curent
                            className={`csel-option${opt.value === value ? ' csel-option--active' : ''}${colorMap?.[opt.value] ? ` csel-color--${colorMap[opt.value]}` : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                            {/* Iconita check apare doar langa optiunea selectata */}
                            {opt.value === value && (
                                <FontAwesomeIcon icon={faCheck} style={{ width: 13, height: 13 }} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
