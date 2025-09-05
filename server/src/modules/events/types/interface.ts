import { Document } from 'mongoose';
import { EventStatus, EventType, TicketType, RegistrationStatus } from './enum';

export interface ILocation {
  venue: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ISponsor {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  sponsorshipType: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'media' | 'partner';
}

export interface IHighlight {
  title: string;
  description?: string;
  icon?: string;
}

export interface ITicketInfo {
  type: TicketType;
  price?: number;
  currency?: string;
  totalTickets?: number;
  availableTickets?: number;
  registrationDeadline?: Date;
  registrationStatus: RegistrationStatus;
}

export interface IAgenda {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
  duration?: number; // in minutes
}

export interface ISpeaker {
  name: string;
  designation?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface IEvent extends Document {
  title: string;
  description: string;
  shortDescription?: string;
  eventImage?: string;
  eventType: EventType;
  status: EventStatus;
  
  // Date and Time
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timeZone?: string;
  
  // Location
  location: ILocation;
  isVirtual: boolean;
  virtualMeetingLink?: string;
  
  // Registration and Tickets
  ticketInfo: ITicketInfo;
  maxAttendees?: number;
  
  // Event Details
  sponsors?: ISponsor[];
  highlights?: IHighlight[];
  agenda?: IAgenda[];
  speakers?: ISpeaker[];
  
  // Engagement
  interestedCount: number;
  registeredCount: number;
  attendedCount?: number;
  
  // Metadata
  tags?: string[];
  category?: string;
  targetAudience?: string[];
  prerequisites?: string[];
  
  // Social and Contact
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  
  // System fields
  createdBy: string; // User ID who created the event
  updatedBy?: string; // User ID who last updated the event
  isActive: boolean;
  isFeatured: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventQuery {
  status?: EventStatus;
  eventType?: EventType;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  isFeatured?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IEventResponse {
  events: IEvent[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IRegisterEventRequest {
  eventId: string;
  userId: string;
  registrationData?: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    designation?: string;
    additionalInfo?: Record<string, any>;
  };
}

export interface IEventRegistration extends Document {
  eventId: string;
  userId: string;
  registrationDate: Date;
  status: 'registered' | 'attended' | 'cancelled';
  registrationData?: Record<string, any>;
  checkInTime?: Date;
  feedback?: {
    rating: number;
    comment?: string;
    submittedAt: Date;
  };
}
