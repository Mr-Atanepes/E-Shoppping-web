import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; // Ensure you have appropriate styles
import { useAuth } from '../store/authContext';
import Loader from '../components/Loader'; // Import a loading spinner component

const Profile = () => {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                navigate('/'); // Redirect to login if user is not in context
                return;
            }

            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to fetch profile data. Please try again.');
                logout(); // Clear AuthContext and localStorage on error
                navigate('/'); // Redirect to login
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, navigate, logout]);

    if (loading) {
        return <Loader />; // Show a loading spinner
    }

    if (error) {
        return <p className="error-message">{error}</p>; // Display error message
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1>Welcome, {profileData.name}</h1>
                <p>Email: {profileData.email}</p>
                <p>Role: {profileData.role}</p>
                <button onClick={() => {
                    logout(); 
                    navigate('/'); 
                }}>
                    Logout
                </button>
                <button onClick={() => navigate('/edit-profile')}>
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;