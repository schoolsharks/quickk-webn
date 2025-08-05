import mongoose from "mongoose";


export interface IFeature extends Document {
    name: string;
    description: string;
    isActive: boolean;
}

export interface ICompanyFeature extends Document {
    _id: mongoose.Types.ObjectId;
    company: mongoose.Types.ObjectId;
    features: mongoose.Types.ObjectId[];
}
