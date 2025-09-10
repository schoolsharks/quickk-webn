import { Document } from "mongoose";
import { EventStatus } from "./enum";

export interface IEvent extends Document {
  title: string;
  description?: string;
  eventImage?: string;
  status: EventStatus;

  // Date and Time
  startDate: Date;
  endDate: Date;

  // Location
  location?: string;
  isVirtual: boolean;
  virtualMeetingLink?: string;

  // Registration and Tickets
  ticketInfo: {
    price?: number;
    currency?: string;
  };

  // Event Details
  sponsors?: string[];
  highlights?: string[];

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

export interface IEventRegistration extends Document {
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
}
