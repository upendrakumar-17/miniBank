import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import './style/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        holderName: '',
        email: '',
        phone: '',
        balance: 0 
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const res = await API.post('/create', formData);
            
            // 1. Success Message
            setMessage({ text: "Registration Successful! Entering Dashboard...", type: "success" });

            // 2. Auto-Login: Store the newly created user in localStorage
            // This ensures User.jsx can find the data immediately
            localStorage.setItem('bankUser', JSON.stringify(res.data.account));

            // 3. Redirect: Navigate to the User page after 1.5 seconds
            
            navigate('/user');
            

        } catch (err) {
            const errorMsg = err.response?.data.error || "Failed to create account.";
            setMessage({ text: errorMsg, type: "error" });
        }
    };

    return (
        <div className="register-card">
            <div className="register-header">
                <h2>Open New Online Account</h2>
                <p>Join SYMB Online Bank in seconds</p>
            </div>

            {/* Output Display Panel */}
            {message.text && (
                <div className={`register-output-panel register-output-panel-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
                <div className="register-form-group">
                    <label>Full Name</label>
                    <input className="register-input" name="holderName" value={formData.holderName} onChange={handleChange} required />
                </div>
                <div className="register-form-group">
                    <label>Email Address</label>
                    <input className="register-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="register-form-group">
                    <label>Phone Number</label>
                    <input className="register-input" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="register-form-group">
                    <label>Initial Deposit (₹)</label>
                    <input className="register-input" type="number" name="balance" value={formData.balance} onChange={handleChange} />
                </div>
                <button type="submit" className="register-btn">Register & Login</button>
            </form>
        </div>
    );
};

export default Register;