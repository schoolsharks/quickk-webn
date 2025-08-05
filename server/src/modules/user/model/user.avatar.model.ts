import { Schema, model } from 'mongoose';
import { IAvatar } from '../types/interfaces';

const AvatarSchema = new Schema<IAvatar>({
    src: { type: String, required: true },
});

const Avatar = model<IAvatar>('Avatar', AvatarSchema);
export default Avatar;