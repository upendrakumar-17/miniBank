const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// 1. Create Account
// router.post('/create', async (req, res) => {
//     try {
//         const account = await Account.create(req.body);
//         res.status(201).json(account);
//     } catch (err) {
//         res.status(400).json({ error: "Creation failed. Account number must be unique." });
//     }
// });
// router.post('/create', async (req, res) => {
//     try {
//         const { holderName, email, phone, balance, isKYCVerified } = req.body;
        
//         const account = new Account({
//             holderName,
//             email,
//             phone,
//             balance,
//             isKYCVerified
//         });

//         await account.save();
//         res.status(201).json({
//             message: "Account created successfully!",
//             accountDetails: account
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(400).json({ error: "Failed to create account. Ensure email is unique if required." });
//     }
// });

router.post('/create', async (req, res) => {
    try {
        const { holderName, email, phone, balance, isKYCVerified } = req.body;

        // 1. Check if email already exists
        const existingAccount = await Account.findOne({ email: email.toLowerCase() });
        
        if (existingAccount) {
            return res.status(400).json({ 
                error: "Validation Failed: An account with this email already exists." 
            });
        }

        // 2. If it doesn't exist, proceed with creation
        const account = new Account({ 
            holderName, 
            email, 
            phone, 
            balance, 
            isKYCVerified 
        });

        await account.save();
        
        res.status(201).json({
            message: "Account created successfully!",
            account
        });
    } catch (err) {
        console.error("Creation Error:", err);
        res.status(500).json({ error: "Server error during account creation." });
    }
});

// 2. Account Listing (Fetch All)
router.get('/all', async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: "Error fetching accounts." });
    }
});

// 3. Transfer Money (The Core Validation Logic)
// router.post('/transfer', async (req, res) => {
//     const { senderNo, receiverNo, amount } = req.body;

//     try {
//         const sender = await Account.findOne({ accountNo: senderNo });
//         const receiver = await Account.findOne({ accountNo: receiverNo });

//         if (!sender || !receiver) return res.status(404).json({ error: "One or both accounts not found." });

//         // Mandatory Validations
//         if (!sender.isKYCVerified) {
//             return res.status(403).json({ error: "Validation Failed: Sender is not KYC verified." });
//         }

//         if (sender.balance < amount) {
//             return res.status(400).json({ error: "Validation Failed: Insufficient balance." });
//         }

//         // Execute Transaction
//         sender.balance -= Number(amount);
//         receiver.balance += Number(amount);

//         await sender.save();
//         await receiver.save();

//         res.json({ message: "Transfer Successful!", senderBalance: sender.balance });
//     } catch (err) {
//         res.status(500).json({ error: "Transaction error." });
//     }
// });

// module.exports = router;
// 3. Transfer Money (Mandatory Validation Logic)
router.post('/transfer', async (req, res) => {
    const { senderNo, receiverNo, amount } = req.body;

    try {
        const sender = await Account.findOne({ accountNo: senderNo });
        const receiver = await Account.findOne({ accountNo: receiverNo });

        // Basic existence check
        if (!sender || !receiver) {
            return res.status(404).json({ error: "One or both accounts not found." });
        }

        // a. Sender must be KYC verified (Requirement 4a)
        if (!sender.isKYCVerified) {
            return res.status(403).json({ error: "Transfer Failed: Sender is not KYC verified." });
        }

        // b. Sender must have a sufficient balance (Requirement 4b)
        if (sender.balance < amount) {
            return res.status(400).json({ error: "Transfer Failed: Insufficient balance." });
        }

        // Transaction Handling
        sender.balance -= Number(amount);
        receiver.balance += Number(amount);

        await sender.save();
        await receiver.save();

        res.json({ 
            message: "Transfer successful!", 
            senderBalance: sender.balance 
        });
    } catch (err) {
        res.status(500).json({ error: "An error occurred during transfer." });
    }
});

// 4a. REQUEST OTP
router.post('/request-otp', async (req, res) => {
    const { accountNo } = req.body;
    try {
        const account = await Account.findOne({ accountNo });
        if (!account) return res.status(404).json({ error: "Account not found" });

        // Generate 6-digit OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP and set expiry (e.g., 5 minutes from now)
        account.otp = generatedOtp;
        account.otpExpires = Date.now() + 300000; 
        await account.save();

        // FOR DEMO: Log it so you can see it in your terminal
        console.log(`[DEMO ONLY] OTP for ${account.holderName}: ${generatedOtp}`);

        res.json({ message: "OTP sent successfully! Check your server console." });
    } catch (err) {
        res.status(500).json({ error: "Error requesting OTP" });
    }
});

// 4b. VERIFY OTP & ACTIVATE KYC
router.patch('/verify-otp', async (req, res) => {
    const { accountNo, otp } = req.body;
    try {
        const account = await Account.findOne({ accountNo });

        if (!account) return res.status(404).json({ error: "Account not found" });

        // Check if OTP matches and hasn't expired
        if (account.otp !== otp || Date.now() > account.otpExpires) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Success: Clear OTP fields and verify KYC
        account.isKYCVerified = true;
        account.otp = undefined;
        account.otpExpires = undefined;
        await account.save();

        res.json({ message: "KYC Verified successfully!", account });
    } catch (err) {
        res.status(500).json({ error: "Error during verification" });
    }
});

module.exports = router;