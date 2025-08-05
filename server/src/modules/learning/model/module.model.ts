import { Schema, model, Types } from 'mongoose';
import { CompletionStatus, ModuleType } from '../types/enums';
import { IModule } from '../types/interfaces';


// Schema for the Module model
const ModuleSchema = new Schema<IModule>(
    {
        type: {
            type: String,
            enum: Object.values(ModuleType),
        },
        title:{
            type: String,
            required: true,
        },
        duration:{
            type: String,
        },
        assessment: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Question',
            },
        ],
        completionStatus:{
            type: String,
            enum: Object.values(CompletionStatus),
            default: CompletionStatus.INCOMPLETE,
        },
        content: {
            type: Schema.Types.Mixed,
            required: function (this: IModule) {
                return this.type === ModuleType.VIDEO || this.type === ModuleType.QUESTION;
            },
            validate: {
                validator: function (this: IModule, value: any) {
                    if (this.type === ModuleType.VIDEO) {
                        return typeof value === 'string';
                    } else if (this.type === ModuleType.QUESTION) {
                        return (
                            Array.isArray(value) &&
                            value.every((id) => Types.ObjectId.isValid(id))
                        );
                    }
                    return true;
                },
                message: 'Invalid content format for the given type.',
            },
        },
    },
    {
        timestamps: true,
    }
);

// Export the Module model
const Module = model<IModule>('Module', ModuleSchema);
export default Module;