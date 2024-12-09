import React, { useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({
  modalData,
  setModalData,
  inputCode,
  setInputCode,
  emailCode,
  emailCodeSent,
  handleSendEmailCode,
  handleSave,
  errorMessage,
  setIsEditing
}) => {
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData({
      ...modalData,
      [name]: value,
    });
  };

  const handleSaveWithValidation = () => {
    // Check if verification code is empty
    if (!inputCode.trim()) {
      setValidationError('Không được để trống mã xác minh.');
    } else {
      setValidationError('');  // Clear validation error if code is valid
      handleSave();  // Call handleSave when validation passes
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Edit Profile</h3>

        {/* Mã xác minh */}
        <div className={styles.modalInputs}>
          <label>Enter Verification Code:</label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          {!emailCodeSent ? (
            <button className={styles.sendEmailBtn} onClick={handleSendEmailCode}>
              Send Code
            </button>
          ) : (
            <p>Code sented to email</p>
          )}
        </div>

        {/* Thông báo lỗi nếu mã xác minh trống */}
        {validationError && <p className={styles.errorMessage}>{validationError}</p>}

        <div className={styles.modalInputs}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={modalData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.modalInputs}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={modalData.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.modalInputs}>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={modalData.phone}
            onChange={handleChange}
          />
        </div>
        <div className={styles.modalInputs}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={modalData.address}
            onChange={handleChange}
          />
        </div>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <div className={styles.modalActions}>
          <button
            className={styles.cancelBtn}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSaveWithValidation}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
