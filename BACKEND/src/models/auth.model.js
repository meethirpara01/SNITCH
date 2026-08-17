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
    password: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer',
    },
}, { timestamps: true });

userSchema.pre('save', async () => {
    if(this.isModified('password')) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
});

userSchema.methods.comparePassword = async (password) => {
    return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model('User', userSchema);
export default UserModel;