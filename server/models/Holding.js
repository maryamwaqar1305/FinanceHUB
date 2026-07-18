const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    asset: { type: String, required: true },
    quantity: { type: Number, required: true },
    buyPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
}, { timestamps: true });

module.exports = mongoose.model('Holding', HoldingSchema);
