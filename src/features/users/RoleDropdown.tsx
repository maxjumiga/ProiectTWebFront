import { useState, useRef, useEffect } from 'react';

interface RoleDropdownProps {
    value: 'admin' | 'user';
    onChange: (role: 'admin' | 'user') => void;
}

export default function RoleDropdown({ value, onChange }: RoleDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="role-dropdown-container" ref={dropdownRef}>
            <button
                type="button"
                className={`role-dropdown-trigger ${value}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value === 'admin' ? 'Admin' : 'User'}</span>
                <svg className="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M7 10l5 5 5-5z" fill="currentColor" />
                </svg>
            </button>
            {isOpen && (
                <div className="role-dropdown-menu">
                    <button
                        type="button"
                        className="role-dropdown-item"
                        onClick={() => {
                            onChange('user');
                            setIsOpen(false);
                        }}
                    >
                        <span className="dot user"></span>
                        User
                    </button>
                    <button
                        type="button"
                        className="role-dropdown-item"
                        onClick={() => {
                            onChange('admin');
                            setIsOpen(false);
                        }}
                    >
                        <span className="dot admin"></span>
                        Admin
                    </button>
                </div>
            )}
        </div>
    );
}
