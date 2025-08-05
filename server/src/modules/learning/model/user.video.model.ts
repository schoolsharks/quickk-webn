import { Schema, model } from 'mongoose';
import { IUserVideo } from '../types/interfaces';

const UserVideoSchema = new Schema<IUserVideo>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    videoId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    isVideoWatched: { type: Boolean, default: false }
});

const UserVideo = model<IUserVideo>('UserVideo', UserVideoSchema);
export default UserVideo;