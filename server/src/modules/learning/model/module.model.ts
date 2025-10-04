import { Schema, model, Types } from "mongoose";
import { CompletionStatus, ModuleType, ResourceType } from "../types/enums";
import { IModule } from "../types/interfaces";

// Schema for the Module model
// module.model.ts
const ModuleSchema = new Schema<IModule>(
  {
    type: {
      type: String,
      enum: Object.values(ModuleType),
    },
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    assessment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    flashcards: [
      // Add this new field
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    completionStatus: {
      type: String,
      enum: Object.values(CompletionStatus),
      default: CompletionStatus.INCOMPLETE,
    },
    resources: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: {
          type: String,
          enum: Object.values(ResourceType),
          required: true,
        },
      },
    ],
    content: {
      type: Schema.Types.Mixed,
      required: function (this: IModule) {
        return (
          this.type === ModuleType.VIDEO ||
          this.type === ModuleType.QUESTION ||
          this.type === ModuleType.AUDIO
        );
      },
      validate: {
        validator: function (this: IModule, value: any) {
          if (this.type === ModuleType.VIDEO) {
            return typeof value === "string";
          } else if (this.type === ModuleType.QUESTION) {
            return (
              Array.isArray(value) &&
              value.every((id) => Types.ObjectId.isValid(id))
            );
          } else if (this.type === ModuleType.AUDIO) {
            return (
              typeof value === "object" &&
              value !== null &&
              typeof value.audioUrl === "string" &&
              Array.isArray(value.captions) &&
              value.captions.every(
                (caption: any) =>
                  typeof caption.startTime === "number" &&
                  typeof caption.endTime === "number" &&
                  typeof caption.text === "string"
              )
            );
          }
          return true;
        },
        message: "Invalid content format for the given type.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Export the Module model
const Module = model<IModule>("Module", ModuleSchema);
export default Module;
