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
    const result = await Event.findByIdAndDelete(
      eventId
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
   * Get today's events based on date (not status)
   */
  async getTodaysEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const filter = {
      status: { $ne: EventStatus.DRAFT }, // Exclude draft events
      $or: [
        // Events that start today
        {
          startDate: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        },
        // Events that are ongoing today (started before today but end today or later)
        {
          startDate: { $lt: startOfDay },
          endDate: { $gte: startOfDay }
        }
      ]
    };

    const skip = (page - 1) * limit;
    const sortOptions = { startDate: 1 as const };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
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
   * Get upcoming events based on date (not status) - events that start after today
   */
  async getUpcomingEventsByDate(
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    const today = new Date();
    const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const filter = {
      status: { $ne: EventStatus.DRAFT }, // Exclude draft events
      startDate: { $gte: startOfTomorrow }
    };

    const skip = (page - 1) * limit;
    const sortOptions = { startDate: 1 as const };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
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
   * Get past events based on date (not status) - events that ended before today
   */
  async getPastEventsByDate(
    page: number = 1,
    limit: number = 10
  ): Promise<IEventResponse> {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const filter = {
      status: { $ne: EventStatus.DRAFT }, // Exclude draft events
      endDate: { $lt: startOfToday }
    };

    const skip = (page - 1) * limit;
    const sortOptions = { startDate: -1 as const }; // Latest first for past events

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
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
   * Get the latest upcoming event (for fallback when no today's events)
   */
  async getLatestUpcomingEvent(): Promise<IEvent | null> {
    const today = new Date();
    const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const event = await Event.findOne({
      status: { $ne: EventStatus.DRAFT }, // Exclude draft events
      startDate: { $gte: startOfTomorrow }
    })
    .sort({ startDate: 1 })
    .lean();

    return event as IEvent | null;
  }

  /**
   * Get event statistics
   */
  async getEventStatistics() {
    const [totalEvents, upcomingEvents, activeEvents, pastEvents] =
      await Promise.all([
        Event.countDocuments(),
        Event.countDocuments({ status: EventStatus.UPCOMING }),
        Event.countDocuments({ status: EventStatus.ACTIVE }),
        Event.countDocuments({ status: EventStatus.PAST }),
      ]);

    return {
      totalEvents,
      upcomingEvents,
      activeEvents,
      pastEvents,
    };
  }

  /**
   * Get admin event statistics with more detailed breakdown
   */
  async getAdminEventStats() {
    const [total, drafts, online, offline] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: EventStatus.DRAFT }),
      Event.countDocuments({ isVirtual: true }),
      Event.countDocuments({ isVirtual: false }),
    ]);

    return {
      total,
      drafts,
      online,
      offline,
    };
  }

  /**
   * Get all events for admin with comprehensive data
  //  */
  async getAllEventsAdmin(query: IEventQuery): Promise<IEventResponse> {
    const {
      status,
      city,
      startDate,
      endDate,
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    // Build filter object including inactive events for admin
    const filter: any = {};

    if (status) {
      // Only include past events if status is explicitly 'PAST'
      if (status === EventStatus.PAST) {
        filter.status = status;
      } else {
        // Exclude past events from results unless status is 'PAST'
        filter.status = { $ne: EventStatus.PAST };
        if (status) {
          filter.status = status;
        }
      }
    } else {
      // If no status is provided, exclude past events by default
      filter.status = { $ne: EventStatus.PAST };
    }

    if (city) {
      filter.location = new RegExp(city, "i");
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

    // Execute query with all fields needed for admin
    const [events, total] = await Promise.all([
      Event.find(filter)
        .select("+createdBy +updatedBy +isActive")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
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
   * Advanced search for admin with multiple criteria
   */
  async searchEventsAdmin(searchParams: {
    searchTerm?: string;
    startDate?: Date;
    city?: string;
    status?: EventStatus;
    page: number;
    limit: number;
  }): Promise<IEventResponse> {
    const { searchTerm, startDate, city, status, page, limit } = searchParams;

    // Build search filter
    const filter: any = {};

    // Text search across multiple fields
    if (searchTerm) {
      filter.$or = [
        { title: new RegExp(searchTerm, "i") },
        { description: new RegExp(searchTerm, "i") },
        { organizer: new RegExp(searchTerm, "i") },
      ];
    }

    // Date filter
    if (startDate) {
      const searchDate = new Date(startDate);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      filter.startDate = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // City filter
    if (city) {
      filter.location = new RegExp(city, "i");
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .select("+createdBy +updatedBy +isActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
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
   * Clone an existing event
   */
  async cloneEvent(eventId: string, createdBy: string): Promise<IEvent | null> {
    const originalEvent = await Event.findById(eventId).lean();

    if (!originalEvent) {
      return null;
    }

    // Create cloned event data
    const clonedEventData = {
      ...originalEvent,
      _id: undefined, // Remove original ID
      title: `${originalEvent.title} (Cloned)`,
      status: EventStatus.DRAFT,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Reset counts
      interestedCount: 0,
      attendedCount: 0,
    };

    const clonedEvent = new Event(clonedEventData);
    await clonedEvent.save();

    return clonedEvent.toObject() as IEvent;
  }

  /**
   * Create a blank event for admin editing
   */
  async createBlankEvent(createdBy: string): Promise<IEvent> {
    const blankEventData = {
      title: "New Event",
      description: "Description goes here...",
      status: EventStatus.DRAFT,
      eventType: "OFFLINE" as const,
      targetAudience: ["All"],
      eventDateTime: new Date(),
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
      location: "",
      address: "",
      isVirtual: false,
      speakers: [],
      keyHighlights: [],
      ticketTypes: [],
      ticketPrice: 0,
      starsToBeEarned: 50,
      registrationLink: "",
      ticketInfo: {
        price: 0,
        currency: "INR",
      },
      sponsors: [],
      highlights: [],
      interestedCount: 0,
      attendedCount: 0,
      organizer: "",
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const blankEvent = new Event(blankEventData);
    await blankEvent.save();

    return blankEvent.toObject() as IEvent;
  }
}
