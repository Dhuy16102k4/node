import React, { useState } from 'react';
import './Profile.css'; // This is for non-modular global styles
import Modal from './Modal'; // Import the new Modal component

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '0123456789',
    address: '123 Main St, City, Country',
    purchaseCount: 5,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [modalData, setModalData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
  });

  const handleSendEmailCode = () => {
    setEmailCodeSent(true);
    const randomCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    setEmailCode(randomCode);
    console.log('Email verification code sent:', randomCode);
  };

  const handleSave = () => {
    if (inputCode === emailCode) {
      setProfile(modalData);
      setIsEditing(false);
      setErrorMessage('');
      console.log('Profile saved:', profile);
    } else {
      setErrorMessage('The verification code is incorrect. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
      </div>

      <div className="profile-content">
        <div className="profile-details">
          <div className="profile-info">
            <label>Name:</label>
            <p>{profile.name}</p>
          </div>
          <div className="profile-info">
            <label>Email:</label>
            <p>{profile.email}</p>
          </div>
          <div className="profile-info">
            <label>Phone:</label>
            <p>{profile.phone}</p>
          </div>
          <div className="profile-info">
            <label>Address:</label>
            <p>{profile.address}</p>
          </div>
          <div className="profile-info">
            <label>Purchase Count:</label>
            <p>{profile.purchaseCount}</p>
          </div>
        </div>

        {/* Avatar Image */}
        <img 
          src="https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/anh-dai-dien-tet-18.jpg" 
          alt="Avatar" 
          className="profile-avatar" 
        />
      </div>

      <div className="profile-actions">
        <button
          className="edit-btn"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>

      {/* Render the modal only if editing */}
      {isEditing && (
        <Modal
          modalData={modalData}
          setModalData={setModalData}
          inputCode={inputCode}
          setInputCode={setInputCode}
          emailCode={emailCode}
          emailCodeSent={emailCodeSent}
          handleSendEmailCode={handleSendEmailCode}
          handleSave={handleSave}
          errorMessage={errorMessage}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Profile;
