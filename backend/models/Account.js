const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNo: { 
    type: String, 
    unique: true 
  },
  holderName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  balance: { type: Number, default: 0, min: 0 },
  isKYCVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

// Auto-generate account number before saving
// accountSchema.pre('save', function (next) {
//   if (!this.accountNo) {
//     this.accountNo = 'SYMB-' + Math.floor(100000 + Math.random() * 900000);
//   }
//   next();
// });
accountSchema.pre('save', function () {
  // Only generate if it's a new document AND accountNo isn't set
  if (this.isNew && !this.accountNo) {
    this.accountNo = 'SYMB-' + Math.floor(100000 + Math.random() * 900000);
  }
  
});

module.exports = mongoose.model('Account', accountSchema);

// const mongoose = require('mongoose');

// const accountSchema = new mongoose.Schema({
//   accountNo: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
  
//   holderName: { 
//     type: String, 
//     required: true 
//   },
  
//   balance: { 
//     type: Number, 
//     required: true, 
//     default: 0,
//     min: 0 
//   },
//   isKYCVerified: { 
//     type: Boolean, 
//     default: false 
//   }
// }, { timestamps: true }); // Automatically tracks when accounts are created

// module.exports = mongoose.model('Account', accountSchema);