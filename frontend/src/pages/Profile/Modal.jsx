import React, { useState, useEffect } from 'react';
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
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [codeSentMessage, setCodeSentMessage] = useState('');  // State for success message

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
      setValidationError('Verification code cannot be left blank.');
    } else {
      setValidationError('');  // Clear validation error if code is valid
      handleSave();  // Call handleSave when validation passes
    }
  };

  const handleSendCode = () => {
    handleSendEmailCode(); // Trigger the email code sending function
    setTimerActive(true);   // Activate the timer
    setCodeSentMessage('Code has been sent to your email...');  // Set the success message
  };

  useEffect(() => {
    let timer;
    if (timerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer); // Stop the timer when it reaches zero
    }
    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [timerActive, countdown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
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
            <button
              className={styles.sendEmailBtn}
              onClick={handleSendCode}
              disabled={timerActive}
            >
              {timerActive ? `Sent! ${formatTime(countdown)}` : 'Send Code'}
            </button>
          ) : (
            <p>Code sent to email</p>
          )}
        </div>

        {/* Success message when code is sent */}
        {codeSentMessage && <p className={styles.successMessage}>{codeSentMessage}</p>}

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
