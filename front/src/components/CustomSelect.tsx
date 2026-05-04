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
    value: string;                     // Currently selected value
    onChange: (value: string) => void; // Callback called when an option is selected
    options: SelectOption[];           // List of available options
    placeholder?: string;             // Text displayed when nothing is selected
    variant?: 'default' | 'inline' | 'form'; // Visual style of the dropdown
    colorMap?: Record<string, string>; // Map: value → CSS color class
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    variant = 'default',
    colorMap,
}: CustomSelectProps) {
    // Dropdown open/closed state
    const [open, setOpen] = useState(false);

    // Reference to the DOM container for outside click detection
    const ref = useRef<HTMLDivElement>(null);

    // Find the currently selected option to display its label
    const selected = options.find(o => o.value === value);

    // Color class for the trigger button (e.g., "admin" → "csel-color--admin")
    const colorKey = colorMap?.[value] ?? '';

    // Effect: close the dropdown when the user clicks outside it
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        // Add global event listener on mount
        document.addEventListener('mousedown', handleClick);
        // Clean up event listener on unmount
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Select an option and close the dropdown
    function handleSelect(val: string) {
        onChange(val);
        setOpen(false);
    }

    return (
        <div
            ref={ref}
            // Dynamic class: variant + open state (for arrow animation)
            className={`csel csel--${variant}${open ? ' csel--open' : ''}`}
        >
            {/* Trigger button — opens/closes the dropdown on click */}
            <button
                type="button"
                className={`csel-trigger${colorKey ? ` csel-color--${colorKey}` : ''}`}
                onClick={() => setOpen(prev => !prev)}
            >
                <span className="csel-label">{selected?.label ?? placeholder}</span>
                {/* Chevron arrow — rotates 180° when open via CSS */}
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
