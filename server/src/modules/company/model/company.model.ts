import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface with _id
export interface ICompany extends Document {
    companyName: string;
    companyCode: string;
    _id: Types.ObjectId; // Optional here because Document already includes it
}

const companySchema: Schema<ICompany> = new Schema<ICompany>({
    companyName: { type: String, required: true },
    companyCode: { type: String, required: true, unique: true },
}, { timestamps: true }); // optional: adds createdAt & updatedAt

const Company = mongoose.model<ICompany>('Company', companySchema);
export default Company;
