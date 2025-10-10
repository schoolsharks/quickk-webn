import { EventStatus } from "./enum";
import mongoose from "mongoose";

export interface IEvent {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  eventImage?: string;
  status: EventStatus;

  // Event Type and Audience
  eventType: 'ONLINE' | 'OFFLINE';
  targetAudience: ('All' | 'Gowomania Only' | 'Webn Only')[];

  // Date and Time
  startDate: Date;
  endDate: Date;

  // Location
  location?: string;
  isVirtual: boolean;
  virtualMeetingLink?: string;

  // Speakers
  speakers?: {
    name: string;
    designation: string;
  }[];

  // Key Highlights
  keyHighlights?: string[];

  // Registration and Tickets
  ticketTypes?: ('Paid' | 'Free')[];
  starsToBeEarned?: number;
  registrationLink?: string;
  ticketInfo: {
    price?: number;
    currency?: string;
  };

  // Event Details
  sponsors?: {
    name: string;
    logo?: string;
  }[];
  highlights?: string[];

  // Custom Sections
  customSections?: {
    title: string;
    description: string;
  }[];

  // Engagement
  interestedCount: number;
  attendedCount?: number;

  //Organizer Details
  organizer?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IEventQuery {
  status?: EventStatus;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  isFeatured?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?: string;
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

export interface IEventRegistration {
  _id?: mongoose.Types.ObjectId;
  eventId: string;
  userId: string;
  registrationDate: Date;
  status: "registered" | "attended" | "cancelled";
  registrationData?: Record<string, any>;
  checkInTime?: Date;
  feedback?: {
    rating: number;
    comment?: string;
    submittedAt: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
