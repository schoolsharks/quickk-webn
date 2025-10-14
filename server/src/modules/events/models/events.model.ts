import { Schema, model } from 'mongoose';
import { IEvent, IEventRegistration } from '../types/interface';
import { EventStatus } from '../types/enum';
import { eventLogger } from '../utils/eventLogger';

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

  // Custom Sections
  customSections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    }
  }],

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
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    eventLogger.info('Starting event status update job', { currentDate: today.toISOString() });

    // Statuses that should be excluded from auto-updates
    const excludedStatuses = [EventStatus.DRAFT, EventStatus.PENDING_REVIEW];

    // Update to PAST
    const pastResult = await this.updateMany(
      {
        endDate: { $lt: today },
        status: { $nin: [...excludedStatuses, EventStatus.PAST] }
      },
      { status: EventStatus.PAST }
    );

    // Update to ACTIVE
    const activeResult = await this.updateMany(
      {
        startDate: { $lte: today },
        endDate: { $gte: today },
        status: { $nin: [...excludedStatuses, EventStatus.ACTIVE] }
      },
      { status: EventStatus.ACTIVE }
    );

    // Update to UPCOMING
    const upcomingResult = await this.updateMany(
      {
        startDate: { $gt: today },
        status: { $nin: [...excludedStatuses, EventStatus.UPCOMING] }
      },
      { status: EventStatus.UPCOMING }
    );

    const totalUpdated = pastResult.modifiedCount + activeResult.modifiedCount + upcomingResult.modifiedCount;

    eventLogger.success('Event status update completed', {
      totalUpdated,
      pastEvents: pastResult.modifiedCount,
      activeEvents: activeResult.modifiedCount,
      upcomingEvents: upcomingResult.modifiedCount,
    });

    return {
      success: true,
      totalUpdated,
      details: {
        past: pastResult.modifiedCount,
        active: activeResult.modifiedCount,
        upcoming: upcomingResult.modifiedCount,
      }
    };
  } catch (error) {
    eventLogger.error('Error updating event statuses', error);
    throw error;
  }
};

export const Event = model<IEvent>('Event', EventSchema);
export const EventRegistration = model<IEventRegistration>('EventRegistration', EventRegistrationSchema);
