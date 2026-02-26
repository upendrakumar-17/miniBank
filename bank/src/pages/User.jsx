import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

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

    if (!user) return <p>Loading...</p>;

    return (
        <div className="container">
            {/* MANDATORY UI REQUIREMENT: Output Display Panel */}
            {message.text && (
                <div className={`output-panel ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="card">
                <h2>Welcome, {user.holderName}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p><strong>Account No:</strong> {user.accountNo}</p>
                    <p><strong>Balance:</strong> ₹{user.balance}</p>
                    <p><strong>KYC Status:</strong> {user.isKYCVerified ? "✅ Verified" : "❌ Unverified"}</p>
                </div>

                {!user.isKYCVerified && (
                    <div style={{ marginTop: '10px', padding: '10px', border: '1px solid orange' }}>
                        <p>Complete KYC to unlock transfers</p>
                        {!otpData.showInput ? (
                            <button onClick={handleRequestOTP}>Request OTP</button>
                        ) : (
                            <div>
                                <input placeholder="Enter 6-digit OTP" onChange={(e) => setOtpData({...otpData, code: e.target.value})} />
                                <button onClick={handleVerifyOTP}>Verify</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="card">
                <h3>Transfer Money</h3>
                <form onSubmit={handleTransfer}>
                    <input 
                        placeholder="Receiver Account Number (e.g., SYMB-123456)" 
                        value={transferData.receiverNo}
                        onChange={(e) => setTransferData({...transferData, receiverNo: e.target.value})}
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={transferData.amount}
                        onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                        required 
                    />
                    <button type="submit" disabled={!user.isKYCVerified}>Send Money</button>
                </form>
            </div>
            
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ background: '#e74c3c' }}>Logout</button>
        </div>
    );
};

export default User;