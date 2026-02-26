// ConfirmDeleteModal — dialog de confirmare ștergere, reutilizabil
interface ConfirmDeleteModalProps {
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDeleteModal({ itemName, onConfirm, onCancel }: ConfirmDeleteModalProps) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Confirmare ștergere</h3>
                    <button className="modal-close" onClick={onCancel}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    <p className="confirm-text">
                        Ești sigur că vrei să ștergi <strong>{itemName}</strong>?{' '}
                        Această acțiune nu poate fi anulată.
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="btn-ghost" onClick={onCancel}>Anulează</button>
                    <button className="btn-danger" onClick={onConfirm}>Șterge</button>
                </div>
            </div>
        </div>
    );
}
