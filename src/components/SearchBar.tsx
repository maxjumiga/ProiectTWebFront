// SearchBar — bară de căutare reutilizabilă cu buton de clear
interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Caută...' }: SearchBarProps) {
    return (
        <div className="um-search-wrap">
            <svg className="um-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                className="um-search"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            {value && (
                <button className="um-search-clear" onClick={() => onChange('')} title="Șterge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
}
