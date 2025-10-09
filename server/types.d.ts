import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: mongoose.Types.ObjectId;
        role: 'USER' | 'ADMIN' | 'SUPER-ADMIN';
        companyId: string;
      };
    }
  }
}

export { }; 
