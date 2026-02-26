import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            // We'll use your 'all' endpoint to find the user by email for simplicity
            // or a specific search endpoint if you added one.
            const res = await API.get('/all');
            const userAccount = res.data.find(acc => acc.email.toLowerCase() === email.toLowerCase());

            if (userAccount) {
                // Store user data locally to persist the "session"
                localStorage.setItem('bankUser', JSON.stringify(userAccount));
                
                setMessage({ text: "Login Successful! Redirecting...", type: "success" });
                
                // Redirect to the User Dashboard after a short delay
                navigate('/user');
                
            } else {
                setMessage({ text: "No account found with this email.", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Error connecting to server.", type: "error" });
        }
    };

    return (
        <div className="card">
            <h2>Login to Your Dashboard</h2>

            {/* MANDATORY UI REQUIREMENT: Output Display Panel */}
            {message.text && (
                <div className={`output-panel ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Enter Registered Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="e.g. upendra@example.com"
                        required 
                    />
                </div>
                <button type="submit">Access My Account</button>
            </form>

            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}>Register here</span>
            </p>
        </div>
    );
};

export default Login;