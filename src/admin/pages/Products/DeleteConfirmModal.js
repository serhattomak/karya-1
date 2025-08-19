import React, { useRef } from "react";

const DeleteConfirmModal = ({ productName, onConfirm, onCancel }) => {
  const modalRef = useRef();

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      onCancel();
    }
  };

  return (
    <div className="AdminModalOverlay" ref={modalRef} onClick={handleOverlayClick}>
      <div className="AdminModalContent AdminDeleteModal">
        <div className="AdminModalHeader">
          <h3>Ürünü Sil</h3>
        </div>

        <div className="AdminModalBody">
          <div className="AdminWarningIcon">⚠️</div>
          <p>
            <strong>"{productName}"</strong> adlı ürünü silmek istediğinizden emin misiniz?
          </p>
          <p className="AdminWarningText">
            Bu işlem geri alınamaz!
          </p>
        </div>

        <div className="AdminModalFooter">
          <button type="button" className="AdminCancelBtn" onClick={onCancel}>
            İptal
          </button>
          <button type="button" className="AdminDeleteBtn danger" onClick={onConfirm}>
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
