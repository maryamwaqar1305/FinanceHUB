const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    type: { type: String, required: true },
    deadline: { type: String, required: true }, // Format YYYY-MM-DD
    priority: { type: String, default: 'medium' },
    currency: { type: String, default: 'USD' }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
