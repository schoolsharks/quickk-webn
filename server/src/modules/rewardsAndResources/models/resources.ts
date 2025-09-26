import mongoose from "mongoose";
import { IResources } from "../types/interface";

const ResourcesSchema = new mongoose.Schema<IResources>(
  {
    image: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    subHeading: {
      type: String,
      required: true,
    },
    description: [
      {
        title: {
          type: String,
          required: true,
        },
        points: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
    stars: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Resources = mongoose.model<IResources>(
  "Resources",
  ResourcesSchema
);
