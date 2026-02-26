import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import './style/User.css';

const User = () => {
    const [user, setUser] = useState(null);
    const [transferData, setTransferData] = useState({ receiverNo: '', amount: '' });
    const [otpData, setOtpData] = useState({ showInput: false, code: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('bankUser'));
        if (!storedUser) {
            navigate('/login');
        } else {
            refreshUserData(storedUser.accountNo);
        }
    }, [navigate]);

    const refreshUserData = async (accountNo) => {
        try {
            const res = await API.get('/all');
            const updatedUser = res.data.find(acc => acc.accountNo === accountNo);
            setUser(updatedUser);
            localStorage.setItem('bankUser', JSON.stringify(updatedUser));
        } catch (err) {
            console.error("Failed to refresh data");
        }
    };

    const handleRequestOTP = async () => {
        try {
            await API.post('/request-otp', { accountNo: user.accountNo });
            setOtpData({ ...otpData, showInput: true });
            setMessage({ text: "OTP sent to console!", type: "success" });
        } catch (err) {
            setMessage({ text: "Failed to send OTP", type: "error" });
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await API.patch('/verify-otp', { accountNo: user.accountNo, otp: otpData.code });
            setMessage({ text: "KYC Verified!", type: "success" });
            setOtpData({ showInput: false, code: '' });
            refreshUserData(user.accountNo);
        } catch (err) {
            setMessage({ text: err.response?.data.error || "Invalid OTP", type: "error" });
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/transfer', {
                senderNo: user.accountNo,
                receiverNo: transferData.receiverNo,
                amount: transferData.amount
            });
            setMessage({ text: res.data.message, type: "success" });
            setTransferData({ receiverNo: '', amount: '' });
            refreshUserData(user.accountNo);
        } catch (err) {
            setMessage({ text: err.response?.data.error || "Transfer failed", type: "error" });
        }
    };
    const [actionAmount, setActionAmount] = useState('');

const handleBalanceAction = async (type) => {
    try {
        const endpoint = type === 'deposit' ? '/deposit' : '/withdraw';
        const res = await API.patch(endpoint, { 
            accountNo: user.accountNo, 
            amount: actionAmount 
        });
        
        setMessage({ text: res.data.message, type: "success" });
        setActionAmount('');
        refreshUserData(user.accountNo); // Updates the UI balance immediately
    } catch (err) {
        setMessage({ text: err.response?.data.error || "Action failed", type: "error" });
    }
};

    if (!user) return <p className="user-loading">Loading...</p>;

    return (
        <div className="user-container">
            {/* MANDATORY UI REQUIREMENT: Output Display Panel */}
            {message.text && (
                <div className={`user-output-panel user-output-panel-${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Welcome Section */}
            <div className="user-card user-header-card">
                <h2 className="user-title">Welcome, {user.holderName}</h2>
                <div className="user-info">
                    <div className="user-info-item">
                        <span className="user-info-label">Account No</span>
                        <span className="user-info-value">{user.accountNo}</span>
                    </div>
                    <div className="user-info-item">
                        <span className="user-info-label">Balance</span>
                        <span className="user-balance">₹{user.balance}</span>
                    </div>
                    <div className="user-info-item">
                        <span className="user-info-label">KYC Status</span>
                        <span className={`user-kyc-status ${user.isKYCVerified ? 'verified' : 'unverified'}`}>
                            {user.isKYCVerified ? "✅ Verified" : "❌ Unverified"}
                        </span>
                    </div>
                </div>

                {!user.isKYCVerified && (
                    <div className="user-kyc-section">
                        <p>Complete KYC to unlock transfers</p>
                        {!otpData.showInput ? (
                            <button className="user-btn user-btn-warning" onClick={handleRequestOTP}>Request OTP</button>
                        ) : (
                            <div className="user-otp-input-group">
                                <input 
                                    className="user-input"
                                    placeholder="Enter 6-digit OTP" 
                                    onChange={(e) => setOtpData({...otpData, code: e.target.value})} 
                                />
                                <button className="user-btn user-btn-primary" onClick={handleVerifyOTP}>Verify</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Transfer Section */}
            <div className="user-card user-transfer-card">
                <h3 className="user-card-title">Transfer Money</h3>
                <form onSubmit={handleTransfer} className="user-form">
                    <div className="user-form-group">
                        <input 
                            className="user-input"
                            placeholder="Receiver Account Number (e.g., SYMB-123456)" 
                            value={transferData.receiverNo}
                            onChange={(e) => setTransferData({...transferData, receiverNo: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="user-form-group">
                        <input 
                            className="user-input"
                            type="number" 
                            placeholder="Amount" 
                            value={transferData.amount}
                            onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                            required 
                        />
                    </div>
                    <button type="submit" className="user-btn user-btn-primary" disabled={!user.isKYCVerified}>Send Money</button>
                </form>
            </div>

            {/* Balance Management Section */}
            <div className="user-card user-balance-card">
                <h3 className="user-card-title">Manage Balance</h3>
                <div className="user-form-group">
                    <input 
                        className="user-input"
                        type="number" 
                        placeholder="Enter Amount" 
                        value={actionAmount} 
                        onChange={(e) => setActionAmount(e.target.value)} 
                    />
                </div>
                <div className="user-action-buttons">
                    <button className="user-btn user-btn-success" onClick={() => handleBalanceAction('deposit')}>Deposit</button>
                    <button className="user-btn user-btn-warning" onClick={() => handleBalanceAction('withdraw')}>Withdraw</button>
                </div>
            </div>

            {/* Logout Button */}
            <button className="user-btn user-btn-danger" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
        </div>
    );
};

export default User;