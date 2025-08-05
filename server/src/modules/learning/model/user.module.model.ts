import { Schema, model } from 'mongoose';
import { IUserModule } from '../types/interfaces';


const UserModuleSchema = new Schema<IUserModule>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    module: {
        type: Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const UserModule = model<IUserModule>('UserModule', UserModuleSchema);
export default UserModule;