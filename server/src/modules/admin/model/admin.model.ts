import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    _id:mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: string;
    company: mongoose.Types.ObjectId;
}

const AdminSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ['admin', 'super-admin'], default: 'admin' },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
    },
    { timestamps: true }
);

const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema);



export default Admin;