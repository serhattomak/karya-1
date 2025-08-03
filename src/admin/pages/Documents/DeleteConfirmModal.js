import React from "react";
import "./DeleteConfirmModal.css";

const DeleteConfirmModal = ({ document, onConfirm, onCancel }) => {
  if (!document) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-confirm-modal">
        <div className="modal-header">
          <h3>Dosyayı Sil</h3>
        </div>
        
        <div className="modal-content">
          <div className="warning-icon">⚠️</div>
          <p>
            <strong>"{document.name}"</strong> adlı dosyayı silmek istediğinizden emin misiniz?
          </p>
          {document.description && (
            <p className="document-description">
              Açıklama: {document.description}
            </p>
          )}
          <p className="warning-text">
            Bu işlem geri alınamaz ve dosya kalıcı olarak silinecektir.
          </p>
        </div>
        
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">
            İptal
          </button>
          <button onClick={onConfirm} className="delete-btn">
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
