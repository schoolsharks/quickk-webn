import { Schema, model } from 'mongoose';
import { IEvent, IEventRegistration } from '../types/interface';
import { EventStatus } from '../types/enum';

// Main Event Schema
const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eventImage: {
    type: String
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.DRAFT
  },

  // Event Type and Audience
  eventType: {
    type: String,
    enum: ['ONLINE', 'OFFLINE'],
    default: 'ONLINE'
  },
  targetAudience: [{
    type: String,
    enum: ['All', 'Gowomania Only', 'Webn Only']
  }],


  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },

  // Location
  location: {
    type: String,
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  virtualMeetingLink: {
    type: String
  },

  // Speakers
  speakers: [{
    name: {
      type: String,
    },
    designation: {
      type: String,
    }
  }],

  // Key Highlights
  keyHighlights: [String],

  // Registration and Tickets
  ticketTypes: [{
    type: String,
    enum: ['Paid', 'Free']
  }],
  starsToBeEarned: {
    type: Number,
    default: 0
  },
  registrationLink: {
    type: String
  },
  ticketInfo: {
    price: { type: Number },
    currency: { type: String, default: 'INR' }
  },

  // Event Details
  sponsors: [{
    name: {
      type: String,
    },
    logo: {
      type: String
    }
  }],
  highlights: [String],

  // Engagement
  interestedCount: {
    type: Number,
    default: 0
  },
  attendedCount: {
    type: Number,
    default: 0
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Event Registration Schema
const EventRegistrationSchema = new Schema<IEventRegistration>({
  eventId: {
    type: String,
    required: true,
    ref: 'Event'
  },
  userId: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled'],
    default: 'registered'
  },
  registrationData: {
    type: Schema.Types.Mixed
  },
  checkInTime: Date,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
EventSchema.index({ status: 1, startDate: 1 });
EventSchema.index({ city: 1, status: 1 });
EventSchema.index({ eventType: 1, status: 1 });
EventSchema.index({ isFeatured: 1, status: 1 });
EventSchema.index({ tags: 1 });
EventSchema.index({ createdBy: 1 });

EventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
EventRegistrationSchema.index({ userId: 1 });
EventRegistrationSchema.index({ eventId: 1 });

// Virtual for calculating event duration
EventSchema.virtual('duration').get(function () {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  return 0;
});


// Static method to update event statuses
EventSchema.statics.updateEventStatuses = async function () {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Update to PAST
  await this.updateMany(
    {
      endDate: { $lt: today },
      status: { $ne: EventStatus.PAST }
    },
    { status: EventStatus.PAST }
  );

  // Update to ACTIVE
  await this.updateMany(
    {
      startDate: { $lte: today },
      endDate: { $gte: today },
      status: { $ne: EventStatus.ACTIVE }
    },
    { status: EventStatus.ACTIVE }
  );

  // Update to UPCOMING
  await this.updateMany(
    {
      startDate: { $gt: today },
      status: { $ne: EventStatus.UPCOMING }
    },
    { status: EventStatus.UPCOMING }
  );
};

export const Event = model<IEvent>('Event', EventSchema);
export const EventRegistration = model<IEventRegistration>('EventRegistration', EventRegistrationSchema);
