const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['income', 'expense'] },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, // Format YYYY-MM-DD
    currency: { type: String, default: 'USD' },
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ['weekly', 'monthly', 'yearly', null], default: null },
    lastProcessedDate: { type: String, default: null } // Format YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
