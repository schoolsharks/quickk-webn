import mongoose from "mongoose";
import { IResources } from "../types/interface";
import { ResourceStatus, ResourceType } from "../types/enums";

const ResourcesSchema = new mongoose.Schema<IResources>(
  {
    image: {
      type: String,
      required: function (this: IResources) {
        return this.status === ResourceStatus.ACTIVE;
      },
    },
    heading: {
      type: String,
      required: function (this: IResources) {
        return this.status === ResourceStatus.ACTIVE;
      },
    },
    companyName: {
      type: String,
      required: function (this: IResources) {
        return this.status === ResourceStatus.ACTIVE;
      },
    },
    companyEmail: {
      type: String,
      required: false,
    },
    companyContact: {
      type: String,
      required: false,
    },
    companyLogo: {
      type: String,
      required: false,
    },
    subHeading: {
      type: String,
      required: function (this: IResources) {
        return this.status === ResourceStatus.ACTIVE;
      },
    },
    status: {
      type: String,
      enum: Object.values(ResourceStatus),
      default: ResourceStatus.DRAFT,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ResourceType),
      required: true,
    },
    targetAudience: [
      {
        type: String,
        enum: ["All", "Gowomania Only", "Webn Only"],
      },
    ],
    quantity: {
      type: Number,
      required: function (this: IResources) {
        return this.status === ResourceStatus.ACTIVE;
      },
      default: 1,
    },
    expiryDate: {
      type: Date,
      required: function (this: IResources) {
        return this.status === ResourceStatus.ACTIVE;
      },
    },
    description: [
      {
        title: {
          type: String,
        },
        points: [
          {
            type: String,
          },
        ],
      },
    ],
    stars: {
      type: Number,
      required: function (this: IResources) {
        return this.status === ResourceStatus.ACTIVE;
      },
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
