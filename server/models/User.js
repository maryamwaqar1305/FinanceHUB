const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        firstName: { type: String },
        lastName: { type: String },
        phone: { type: String },
        dateOfBirth: { type: String },
        profilePicture: { type: String }
    }
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candiatePassword) {
    return await bcrypt.compare(candiatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
