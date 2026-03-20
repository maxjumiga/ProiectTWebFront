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
        // Overlay-ul acopera toata pagina; click pe el inchide modalul
        <div className="modal-overlay" onClick={onCancel}>

            {/* Cutia modala — stopPropagation previne inchiderea accidentala la click interior */}
            <div className="modal modal--sm" onClick={e => e.stopPropagation()}>

                {/* Header-ul modala cu titlu si buton inchidere */}
                <div className="modal-header">
                    <h3>Confirmare ștergere</h3>
                    <button className="modal-close" onClick={onCancel}>
                        <FontAwesomeIcon icon={faXmark} style={{ width: 16, height: 16 }} />
                    </button>
                </div>

                {/* Corpul modala cu mesajul de avertizare */}
                <div className="modal-body">
                    <p className="confirm-text">
                        Ești sigur că vrei să ștergi <strong>{itemName}</strong>?{' '}
                        Această acțiune nu poate fi anulată.
                    </p>
                </div>

                {/* Footer-ul with butoanele de actiune */}
                <div className="modal-footer">
                    {/* Buton anulare — inchide modalul fara sa stearga nimic */}
                    <button className="btn-ghost" onClick={onCancel}>Anulează</button>
                    {/* Buton confirmare stergere — apeleaza onConfirm */}
                    <button className="btn-danger" onClick={onConfirm}>Șterge</button>
                </div>
            </div>
        </div>
    );
}
