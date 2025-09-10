import { Event, EventRegistration } from "../models/events.model";
import {
  IEvent,
  IEventQuery,
  IEventResponse,
  IRegisterEventRequest,
  IEventRegistration,
} from "../types/interface";
import { EventStatus } from "../types/enum";
import AppError from "../../../utils/appError";

export class EventService {
  /**
   * Get events with filtering, pagination and sorting
   */
  async getEvents(query: IEventQuery): Promise<IEventResponse> {
    const {
      status,
      city,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "startDate",
      sortOrder = "asc",
    } = query;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (city) {
      filter["location.city"] = new RegExp(city, "i");
    }

    // Date range filter
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) {
        filter.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.startDate.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query
    const [events, total] = await Promise.all([
      Event.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Event.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limit);

    return {
      events: events as IEvent[],
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Get events by status
   */
  async getEventsByStatus(
    status: EventStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    return this.getEvents({ status, page, limit });
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    return this.getEventsByStatus(EventStatus.UPCOMING, page, limit);
  }

  /**
   * Get active events
   */
  async getActiveEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    return this.getEventsByStatus(EventStatus.ACTIVE, page, limit);
  }

  async getMiscellaneousEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    return this.getEventsByStatus(EventStatus.MISCELLANEOUS, page, limit);
  }
  /**
   * Get past events
   */
  async getPastEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    return this.getEventsByStatus(EventStatus.PAST, page, limit);
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId: string): Promise<IEvent | null> {
    const event = await Event.findById(eventId).lean();
    return event as IEvent | null;
  }

  /**
   * Create new event
   */
  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    const event = new Event(eventData);
    await event.save();
    return event.toObject() as IEvent;
  }

  /**
   * Update event
   */
  async updateEvent(
    eventId: string,
    updateData: Partial<IEvent>,
    updatedBy: string
  ): Promise<IEvent | null> {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { ...updateData, updatedBy },
      { new: true, runValidators: true }
    ).lean();

    return event as IEvent | null;
  }

  /**
   * Delete event (soft delete)
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    const result = await Event.findByIdAndUpdate(
      eventId,
      { isActive: false },
      { new: true }
    );

    return !!result;
  }

  /**
   * Search events by title or description
   */
  async searchEvents(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    const filter = {
      isActive: true,
      $or: [
        { title: new RegExp(searchTerm, "i") },
        { description: new RegExp(searchTerm, "i") },
        { shortDescription: new RegExp(searchTerm, "i") },
      ],
    };

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ startDate: 1 }).skip(skip).limit(limit).lean(),
      Event.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      events: events as IEvent[],
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Get events by city
   */
  async getEventsByCity(
    city: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    return this.getEvents({ city, page, limit });
  }

  /**
   * Register user for an event
   */
  async registerForEvent(
    registrationData: IRegisterEventRequest
  ): Promise<IEventRegistration> {
    const { eventId, userId } = registrationData;

    // Check if event exists and is active
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found or inactive", 404);
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      eventId,
      userId,
    });
    if (existingRegistration) {
      throw new AppError("User already registered for this event", 400);
    }

    // Create registration
    const registration = new EventRegistration(registrationData);
    await registration.save();

    // Update event registered count
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    return registration.toObject() as IEventRegistration;
  }

  /**
   * Get user registrations
   */
  async getUserRegistrations(userId: string): Promise<IEventRegistration[]> {
    const registrations = await EventRegistration.find({ userId })
      .populate("eventId")
      .sort({ registrationDate: -1 })
      .lean();

    return registrations as IEventRegistration[];
  }

  /**
   * Get event registrations
   */
  async getEventRegistrations(eventId: string): Promise<IEventRegistration[]> {
    const registrations = await EventRegistration.find({ eventId })
      .sort({ registrationDate: -1 })
      .lean();

    return registrations as IEventRegistration[];
  }

  /**
   * Cancel registration
   */
  async cancelRegistration(eventId: string, userId: string): Promise<boolean> {
    const registration = await EventRegistration.findOneAndUpdate(
      { eventId, userId },
      { status: "cancelled" },
      { new: true }
    );

    if (registration) {
      // Decrease registered count
      await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
      return true;
    }

    return false;
  }

  /**
   * Mark user as attended
   */
  async markAttended(eventId: string, userId: string): Promise<boolean> {
    const registration = await EventRegistration.findOneAndUpdate(
      { eventId, userId, status: "registered" },
      {
        status: "attended",
        checkInTime: new Date(),
      },
      { new: true }
    );

    if (registration) {
      // Increase attended count
      await Event.findByIdAndUpdate(eventId, { $inc: { attendedCount: 1 } });
      return true;
    }

    return false;
  }

  /**
   * Add user to interested list
   */
  async markInterested(eventId: string, userId: string): Promise<boolean> {
    // This could be implemented with a separate collection or as part of user preferences
    // For now, just increment the interested count
    const result = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { interestedCount: 1 } },
      { new: true }
    );

    return !!result;
  }

  /**
   * Update event statuses based on current date
   */
  async updateEventStatuses(): Promise<void> {
    await (Event as any).updateEventStatuses();
  }

  /**
   * Get event statistics
   */
  async getEventStatistics() {
    const [totalEvents, upcomingEvents, activeEvents, pastEvents] =
      await Promise.all([
        Event.countDocuments({ isActive: true }),
        Event.countDocuments({ isActive: true, status: EventStatus.UPCOMING }),
        Event.countDocuments({ isActive: true, status: EventStatus.ACTIVE }),
        Event.countDocuments({ isActive: true, status: EventStatus.PAST }),
      ]);

    return {
      totalEvents,
      upcomingEvents,
      activeEvents,
      pastEvents,
    };
  }
}
