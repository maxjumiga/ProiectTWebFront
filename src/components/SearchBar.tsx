// ============================================================
// components/SearchBar.tsx — Bara de cautare reutilizabila
// Poate fi folosita in orice pagina care necesita filtrare de date.
// Contine:
//   - iconi ta de cautare (Font Awesome)
//   - camp text de input
//   - buton X pentru stergere rapida (apare doar cand exista text)
// ============================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

// Proprietatile acceptate de componenta
interface SearchBarProps {
    value: string;                    // Valoarea curenta a textului de cautare
    onChange: (value: string) => void; // Functia apelata la fiecare modificare
    placeholder?: string;             // Text optional placeholder (default: "Cauta...")
}

export default function SearchBar({ value, onChange, placeholder = 'Caută...' }: SearchBarProps) {
    return (
        // Containerul wrap pozitioneaza iconita si butonul absolut fata de input
        <div className="um-search-wrap">

            {/* Iconita lupa — pozitionata cu CSS absolut in stanga inputului */}
            <FontAwesomeIcon icon={faMagnifyingGlass} className="um-search-icon" style={{ width: 15, height: 15 }} />

            {/* Campul de introducere text — apeleaza onChange la fiecare tasta */}
            <input
                className="um-search"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
            />

            {/* Butonul X — apare doar daca exista text in input (conditional rendering) */}
            {value && (
                <button className="um-search-clear" onClick={() => onChange('')} title="Șterge">
                    <FontAwesomeIcon icon={faXmark} style={{ width: 12, height: 12 }} />
                </button>
            )}
        </div>
    );
}
