import React from "react";
import "./DeleteConfirmModal.css";

const DeleteConfirmModal = ({ document, onConfirm, onCancel }) => {
  if (!document) return null;

  return (
    <div className="AdminModalOverlay">
      <div className="AdminDeleteConfirmModal">
        <div className="AdminModalHeader">
          <h3>Dosyayı Sil</h3>
        </div>
        
        <div className="AdminModalContent">
          <div className="AdminWarningIcon">⚠️</div>
          <p>
            <strong>"{document.name}"</strong> adlı dosyayı silmek istediğinizden emin misiniz?
          </p>
          {document.description && (
            <p className="AdminDocumentDescription">
              Açıklama: {document.description}
            </p>
          )}
          <p className="AdminWarningText">
            Bu işlem geri alınamaz ve dosya kalıcı olarak silinecektir.
          </p>
        </div>
        
        <div className="AdminModalActions">
          <button onClick={onCancel} className="AdminCancelBtn">
            İptal
          </button>
          <button onClick={onConfirm} className="AdminDeleteBtn">
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
