import React from 'react';
import { Link } from 'react-router-dom';
import './style/Home.css';

const Home = () => {
    return (
        <div className="home-card">
            <div className="home-header">
                <h1>Welcome to SYMB Online Bank</h1>
                <p>A secure, minimal system for instant digital transfers.</p>
            </div>
            
            <div className="home-features-grid">
                <div className="home-feature-item">
                    <h3>Secure Transfers</h3>
                    <p>Instant validation for KYC and sufficient balance.</p>
                </div>
                <div className="home-feature-item">
                    <h3>OTP Verification</h3>
                    <p>Enhanced security for account holder validation.</p>
                </div>
                <div className="home-feature-item">
                    <h3>Real-time Updates</h3>
                    <p>Monitor your balance and account status instantly.</p>
                </div>
            </div>

            <div className="home-actions">
                <Link to="/register"><button className="home-btn home-btn-primary">Get Started</button></Link>
                <Link to="/login"><button className="home-btn home-btn-secondary">Login to Dashboard</button></Link>
            </div>
        </div>
    );
};

export default Home;