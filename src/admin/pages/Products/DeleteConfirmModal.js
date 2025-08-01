import React, { useRef } from "react";

const DeleteConfirmModal = ({ productName, onConfirm, onCancel }) => {
  const modalRef = useRef();

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" ref={modalRef} onClick={handleOverlayClick}>
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h3>Ürünü Sil</h3>
        </div>

        <div className="modal-body">
          <div className="warning-icon">⚠️</div>
          <p>
            <strong>"{productName}"</strong> adlı ürünü silmek istediğinizden emin misiniz?
          </p>
          <p className="warning-text">
            Bu işlem geri alınamaz!
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            İptal
          </button>
          <button type="button" className="delete-btn danger" onClick={onConfirm}>
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
