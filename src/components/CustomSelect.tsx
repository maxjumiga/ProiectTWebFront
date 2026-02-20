import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

export interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    variant?: 'default' | 'inline' | 'form';
    colorMap?: Record<string, string>; // value → CSS class suffix
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Selectează...',
    variant = 'default',
    colorMap,
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find(o => o.value === value);
    const colorKey = colorMap?.[value] ?? '';

    // close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function handleSelect(val: string) {
        onChange(val);
        setOpen(false);
    }

    return (
        <div
            ref={ref}
            className={`csel csel--${variant}${open ? ' csel--open' : ''}`}
        >
            <button
                type="button"
                className={`csel-trigger${colorKey ? ` csel-color--${colorKey}` : ''}`}
                onClick={() => setOpen(prev => !prev)}
            >
                <span className="csel-label">{selected?.label ?? placeholder}</span>
                <svg
                    className="csel-arrow"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="csel-dropdown">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`csel-option${opt.value === value ? ' csel-option--active' : ''}${colorMap?.[opt.value] ? ` csel-color--${colorMap[opt.value]}` : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                            {opt.value === value && (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
