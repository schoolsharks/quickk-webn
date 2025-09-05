import mongoose, { Schema, model } from 'mongoose';
import { IEvent, IEventRegistration } from '../types/interface';
import { EventStatus, EventType, TicketType, RegistrationStatus } from '../types/enum';

// Location Schema
const LocationSchema = new Schema({
  venue: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String, required: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
}, { _id: false });

// Sponsor Schema
const SponsorSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String },
  website: { type: String },
  description: { type: String },
  sponsorshipType: {
    type: String,
    enum: ['title', 'platinum', 'gold', 'silver', 'bronze', 'media', 'partner'],
    required: true
  }
}, { _id: false });

// Highlight Schema
const HighlightSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String }
}, { _id: false });

// Ticket Info Schema
const TicketInfoSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(TicketType),
    required: true
  },
  price: { type: Number },
  currency: { type: String, default: 'INR' },
  totalTickets: { type: Number },
  availableTickets: { type: Number },
  registrationDeadline: { type: Date },
  registrationStatus: {
    type: String,
    enum: Object.values(RegistrationStatus),
    default: RegistrationStatus.OPEN
  }
}, { _id: false });

// Agenda Schema
const AgendaSchema = new Schema({
  time: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  speaker: { type: String },
  duration: { type: Number } // in minutes
}, { _id: false });

// Speaker Schema
const SpeakerSchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String },
  company: { type: String },
  bio: { type: String },
  profileImage: { type: String },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    website: { type: String }
  }
}, { _id: false });

// Social Links Schema
const SocialLinksSchema = new Schema({
  website: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  instagram: { type: String }
}, { _id: false });

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
  shortDescription: {
    type: String,
    maxlength: 200
  },
  eventImage: {
    type: String
  },
  eventType: {
    type: String,
    enum: Object.values(EventType),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.UPCOMING
  },
  
  // Date and Time
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  timeZone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  
  // Location
  location: {
    type: LocationSchema,
    required: true
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  virtualMeetingLink: {
    type: String
  },
  
  // Registration and Tickets
  ticketInfo: {
    type: TicketInfoSchema,
    required: true
  },
  maxAttendees: {
    type: Number
  },
  
  // Event Details
  sponsors: [SponsorSchema],
  highlights: [HighlightSchema],
  agenda: [AgendaSchema],
  speakers: [SpeakerSchema],
  
  // Engagement
  interestedCount: {
    type: Number,
    default: 0
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  attendedCount: {
    type: Number,
    default: 0
  },
  
  // Metadata
  tags: [String],
  category: String,
  targetAudience: [String],
  prerequisites: [String],
  
  // Social and Contact
  contactEmail: {
    type: String,
    lowercase: true
  },
  contactPhone: String,
  socialLinks: SocialLinksSchema,
  
  // System fields
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
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
EventSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for checking if registration is open
EventSchema.virtual('isRegistrationOpen').get(function() {
  if (this.ticketInfo.registrationStatus === RegistrationStatus.CLOSED) {
    return false;
  }
  
  if (this.ticketInfo.registrationDeadline && new Date() > this.ticketInfo.registrationDeadline) {
    return false;
  }
  
  if (this.status === EventStatus.PAST) {
    return false;
  }
  
  return true;
});

// Pre-save middleware to update event status based on dates
EventSchema.pre('save', function(next) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventStartDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
  const eventEndDate = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());
  
  if (today > eventEndDate) {
    this.status = EventStatus.PAST;
  } else if (today >= eventStartDate && today <= eventEndDate) {
    this.status = EventStatus.ACTIVE;
  } else {
    this.status = EventStatus.UPCOMING;
  }
  
  // Update available tickets if not set
  if (this.ticketInfo.availableTickets === undefined && this.ticketInfo.totalTickets) {
    this.ticketInfo.availableTickets = this.ticketInfo.totalTickets - this.registeredCount;
  }
  
  next();
});

// Static method to update event statuses
EventSchema.statics.updateEventStatuses = async function() {
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
