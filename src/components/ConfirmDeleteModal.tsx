// ============================================================
// components/ConfirmDeleteModal.tsx — Modal de confirmare stergere
// Apare ca un dialog suprapus peste pagina (overlay) cand
// utilizatorul apasa butonul "Sterge" pe orice element.
// Cere confirmare explicita inainte de a executa stergerea,
// prevenind stergeri accidentale.
// ============================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

// Proprietatile acceptate de componenta
interface ConfirmDeleteModalProps {
    itemName: string;     // Numele elementului ce urmeaza sa fie sters (afisat in mesaj)
    onConfirm: () => void; // Functia apelata cand utilizatorul confirma stergerea
    onCancel: () => void;  // Functia apelata cand utilizatorul anuleaza / inchide modalul
}

export default function ConfirmDeleteModal({ itemName, onConfirm, onCancel }: ConfirmDeleteModalProps) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-card s-modal-card--danger" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>

                <div className="modal-header s-modal-header--danger">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3 style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 700 }}>Confirm deletion</h3>
                    </div>
                    <button className="modal-close" onClick={onCancel}>
                        <FontAwesomeIcon icon={faXmark} style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                <div className="modal-body">
                    <p className="confirm-text" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{itemName}</strong>? This action cannot be undone.
                    </p>
                </div>

                <div className="modal-footer">
                    <button className="btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className="btn-danger" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}
