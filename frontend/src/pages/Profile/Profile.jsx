import React, { useState, useEffect } from 'react';
import './Profile.css';
import Modal from './Modal';
import axiosInstance from '../../utils/axiosConfig';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalData, setModalData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const token = localStorage.getItem('authToken');  // Fetch the token from localStorage

  // Function to create headers with Authorization token
  const createHeaders = () => {
    if (!token) {
      console.error("Token is missing in localStorage");
      return {};  // Return an empty object if there's no token
    }
    console.log("Token from localStorage:", token);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/user/detail/', {
          headers: createHeaders(),
        });

        console.log("API response:", response.data.user);  // Log the API response to see if it's correct

        const userData = response.data.user;
        setProfile({
          name: userData.username,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          purchaseCount: userData.orderCount,
        });

        // Set modal data as well
        setModalData({
          name: userData.username,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage("Failed to load profile data. Please try again.");
      }
    };

    if (token) {
      fetchUserProfile();  // Only call if token exists
    } else {
      setErrorMessage("No token found. Please log in again.");
    }
  }, [token]);  // Re-run the effect if the token changes

  const handleSendEmailCode = async () => {
    try {
      const response = await axiosInstance.get('/user/code', {
        headers: createHeaders(),
      });

      if (response.status === 200) {
        setEmailCode(response.data.verificationCode); // Save verification code
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setErrorMessage("Failed to send verification code. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      // Check if the verification code entered by the user matches the one sent
      if (inputCode !== emailCode) {
        setErrorMessage("Invalid verification code. Please try again.");
        return;  // Exit if verification codes don't match
      }
  
      // Proceed with the PUT request to update user info if codes match
      const response = await axiosInstance.put('/user/update', {
        username: modalData.name,
        email: modalData.email,
        phone: modalData.phone,
        verificationCode: inputCode,  // Send the verification code the user entered
      }, {
        headers: createHeaders(),
      });
  
      if (response.status === 200) {
        setProfile(modalData);  // Update the profile after success
        setIsEditing(false);
        setErrorMessage(''); // Reset error message
        console.log('Profile updated successfully:', response.data.user);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
  
      // Check if there is an error and display the error message
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Failed to update profile. Please try again.');
      } else {
        setErrorMessage("Failed to update profile. Please try again.");
      }
    }
  };
  
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

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

        <img 
          src="https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/anh-dai-dien-tet-18.jpg" 
          alt="Avatar" 
          className="profile-avatar" 
        />
      </div>

      <div className="profile-actions">
        <button
          className="edit-btn"
          onClick={() => {
            console.log("Modal data before editing:", modalData); // Log modalData before editing
            setIsEditing(true);
          }}
        >
          Edit
        </button>
      </div>

      {isEditing && (
        <Modal
          modalData={modalData}
          setModalData={setModalData}
          inputCode={inputCode}
          setInputCode={setInputCode}
          emailCode={emailCode}
          handleSendEmailCode={handleSendEmailCode}
          handleSave={handleSave}  // Ensure this is being passed correctly
          errorMessage={errorMessage}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Profile;
