import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <h1>Welcome to SYMB Online Bank</h1>
            <p>A secure, minimal system for instant digital transfers.</p>
            
            <div className="features-grid" style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '30px 0' }}>
                <div className="feature-item">
                    <h3>Secure Transfers</h3>
                    <p>Instant validation for KYC and sufficient balance.</p>
                </div>
                <div className="feature-item">
                    <h3>OTP Verification</h3>
                    <p>Enhanced security for account holder validation.</p>
                </div>
                <div className="feature-item">
                    <h3>Real-time Updates</h3>
                    <p>Monitor your balance and account status instantly.</p>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <Link to="/register"><button style={{ marginRight: '10px' }}>Get Started</button></Link>
                <Link to="/login"><button style={{ background: '#2c3e50' }}>Login to Dashboard</button></Link>
            </div>
        </div>
    );
};

export default Home;