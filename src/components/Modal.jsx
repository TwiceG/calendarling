import React from "react";
import "../style/Modal.css";


const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null; // Don't render if modal is not open

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="confirm-btn" onClick={onConfirm}>
                        Yes
                    </button>
                    <button className="cancel-btn" onClick={onCancel}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
