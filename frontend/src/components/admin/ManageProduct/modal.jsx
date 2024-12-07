import React from 'react';
import styles from './Product.module.css';

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles['modal-overlay']} onClick={closeModal}></div>
      <div className={styles.modal}>
        <button className={styles['close-btn']} onClick={closeModal}>×</button>
        <div className={styles['modal-content']}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
