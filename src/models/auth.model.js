import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: [function () { return !this.googleId; }, 'Password is required if not using Google authentication'],
    },
    contact: {
        type: String,
        required: [function () { return !this.googleId; }, 'Contact number is required if not using Google authentication'],
        unique: [function () { return !this.googleId; }, 'Contact number must be unique'],
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer',
    },
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.password && !this.googleId) {
        throw new Error('Password is required if not using Google authentication');
    }
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model('User', userSchema);
export default UserModel;