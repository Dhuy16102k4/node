import React from "react";
import styles from "./CategoryManagement.module.css";

const Modal = ({ isVisible, onClose, onSave, categoryData, onInputChange, isEditing }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{isEditing ? "Edit Category" : "Add Category"}</h2>
        <input
          type="text"
          value={categoryData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          placeholder="Enter category name"
          className={styles.input}
        />
        <textarea
          value={categoryData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Enter category description"
          className={styles.textarea}
        />
        <div className={styles.modalActions}>
          <button onClick={onSave} className={styles.buttonSave}>
            {isEditing ? "Save Changes" : "Add Category"}
          </button>
          <button onClick={onClose} className={styles.buttonCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
