import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/events.services";
import { AddressSearchService } from "../services/addressSearch.service";
import { IEventQuery, IRegisterEventRequest } from "../types/interface";
import { EventStatus } from "../types/enum";
import AppError from "../../../utils/appError";

const eventService = new EventService();
const addressSearchService = new AddressSearchService();

export class EventController {
  /**
   * Get all events with filtering and pagination
   */
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const query: IEventQuery = {
        status: req.query.status as EventStatus,
        startDate: req.query.startDate
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: req.query.endDate
          ? new Date(req.query.endDate as string)
          : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const result = await eventService.getEvents(query);

      res.status(200).json({
        success: true,
        message: "Events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await eventService.getUpcomingEvents(page, limit);

      res.status(200).json({
        success: true,
        message: "Upcoming events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active events
   */
  async getActiveEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.query;

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      let result;
      if (type === "miscellaneous") {
        result = await eventService.getMiscellaneousEvents(page, limit);
      } else {
        result = await eventService.getActiveEvents(page, limit);
      }

      res.status(200).json({
        success: true,
        message: "Active events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get past events
   */
  async getPastEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await eventService.getPastEvents(page, limit);

      res.status(200).json({
        success: true,
        message: "Past events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get today's events based on date
   */
  async getTodaysEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await eventService.getTodaysEvents(page, limit);

      res.status(200).json({
        success: true,
        message: "Today's events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get upcoming events based on date
   */
  async getUpcomingEventsByDate(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await eventService.getUpcomingEventsByDate(page, limit);

      res.status(200).json({
        success: true,
        message: "Upcoming events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get past events based on date
   */
  async getPastEventsByDate(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await eventService.getPastEventsByDate(page, limit);

      res.status(200).json({
        success: true,
        message: "Past events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get latest upcoming event (for fallback)
   */
  async getLatestUpcomingEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await eventService.getLatestUpcomingEvent();

      res.status(200).json({
        success: true,
        message: result ? "Latest upcoming event retrieved successfully" : "No upcoming events found",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get event by ID
   */
  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const event = await eventService.getEventById(eventId);

      if (!event) {
        throw new AppError("Event not found", 404);
      }
      res.status(200).json({
        success: true,
        message: "Event retrieved successfully",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new event
   */
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      // Assuming user ID is available in req.user from auth middleware
      const createdBy = req.user?.id;

      if (!createdBy) {
        throw new AppError("Creator information is required", 400);
      }

      const eventData = {
        ...req.body,
        createdBy,
      };

      const event = await eventService.createEvent(eventData);

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update event
   */
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const updatedBy = (req as any).user?.id || req.body.updatedBy;

      if (!updatedBy) {
        throw new AppError("Updater information is required", 400);
      }

      // Process uploaded files
      const files = req.files as Express.MulterS3.File[];
      const eventUpdateData = { ...req.body };

      // Handle event banner image
      if (files && files.length > 0) {
        const eventImageFile = files.find(file => file.fieldname === 'eventImage');
        if (eventImageFile) {
          eventUpdateData.eventImage = eventImageFile.location;
        }

        // Handle sponsor logos
        const sponsorLogoFiles = files.filter(file => file.fieldname.startsWith('sponsor_logo_'));
        if (sponsorLogoFiles.length > 0) {
          const sponsors = JSON.parse(eventUpdateData.sponsors || '[]');
          sponsorLogoFiles.forEach(file => {
            const index = parseInt(file.fieldname.split('_')[2]);
            if (sponsors[index]) {
              sponsors[index].logo = file.location;
            }
          });
          eventUpdateData.sponsors = sponsors;
        }
      }

      // Parse JSON fields
      if (eventUpdateData.targetAudience && typeof eventUpdateData.targetAudience === 'string') {
        eventUpdateData.targetAudience = JSON.parse(eventUpdateData.targetAudience);
      }
      if (eventUpdateData.speakers && typeof eventUpdateData.speakers === 'string') {
        eventUpdateData.speakers = JSON.parse(eventUpdateData.speakers);
      }
      if (eventUpdateData.keyHighlights && typeof eventUpdateData.keyHighlights === 'string') {
        eventUpdateData.keyHighlights = JSON.parse(eventUpdateData.keyHighlights);
      }
      if (eventUpdateData.sponsors && typeof eventUpdateData.sponsors === 'string') {
        eventUpdateData.sponsors = JSON.parse(eventUpdateData.sponsors);
      }
      if (eventUpdateData.ticketTypes && typeof eventUpdateData.ticketTypes === 'string') {
        eventUpdateData.ticketTypes = JSON.parse(eventUpdateData.ticketTypes);
      }

      if (eventUpdateData.ticketInfo && typeof eventUpdateData.ticketInfo === 'string') {
        try {
          eventUpdateData.ticketInfo = JSON.parse(eventUpdateData.ticketInfo);
        } catch (e) {
          throw new AppError("Invalid ticketInfo format", 400);
        }
      }
      if (eventUpdateData.starsToBeEarned) {
        eventUpdateData.starsToBeEarned = parseInt(eventUpdateData.starsToBeEarned);
      }

      if (eventUpdateData.status) {
        eventUpdateData.status = eventUpdateData.status.toLowerCase();
      }

      const event = await eventService.updateEvent(
        eventId,
        eventUpdateData,
        updatedBy
      );

      if (!event) {
        throw new AppError("Event not found", 404);
      }

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete event (soft delete)
   */
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const deleted = await eventService.deleteEvent(eventId);

      if (!deleted) {
        throw new AppError("Event not found", 404);
      }

      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search events
   */
  async searchEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { q: searchTerm } = req.query;

      if (!searchTerm) {
        throw new AppError("Search term is required", 400);
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await eventService.searchEvents(
        searchTerm as string,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Search results retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get events by city
   */
  async getEventsByCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { city } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await eventService.getEventsByCity(city, page, limit);

      res.status(200).json({
        success: true,
        message: `Events in ${city} retrieved successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Register for event
   */
  async registerForEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const userId = (req as any).user?.id || req.body.userId;

      if (!userId) {
        throw new AppError("User authentication is required", 401);
      }

      const registrationData: IRegisterEventRequest = {
        eventId,
        userId,
        registrationData: req.body.registrationData,
      };

      const registration = await eventService.registerForEvent(
        registrationData
      );

      res.status(201).json({
        success: true,
        message: "Successfully registered for event",
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user registrations
   */
  async getUserRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || req.params.userId;

      if (!userId) {
        throw new AppError("User authentication is required", 401);
      }

      const registrations = await eventService.getUserRegistrations(userId);

      res.status(200).json({
        success: true,
        message: "User registrations retrieved successfully",
        data: registrations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get event registrations
   */
  async getEventRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const registrations = await eventService.getEventRegistrations(eventId);

      res.status(200).json({
        success: true,
        message: "Event registrations retrieved successfully",
        data: registrations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel registration
   */
  async cancelRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const userId = (req as any).user?.id || req.body.userId;

      if (!userId) {
        throw new AppError("User authentication is required", 401);
      }

      const cancelled = await eventService.cancelRegistration(eventId, userId);

      if (!cancelled) {
        throw new AppError("Registration not found or already cancelled", 404);
      }

      res.status(200).json({
        success: true,
        message: "Registration cancelled successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark user as attended
   */
  async markAttended(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId, userId } = req.params;

      const marked = await eventService.markAttended(eventId, userId);

      if (!marked) {
        throw new AppError(
          "Registration not found or user not registered",
          404
        );
      }

      res.status(200).json({
        success: true,
        message: "User marked as attended successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark interested
   */
  async markInterested(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const userId = (req as any).user?.id || req.body.userId;

      if (!userId) {
        throw new AppError("User authentication is required", 401);
      }

      const marked = await eventService.markInterested(eventId, userId);

      if (!marked) {
        throw new AppError("Event not found", 404);
      }

      res.status(200).json({
        success: true,
        message: "Marked as interested successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update event statuses (admin function)
   */
  async updateEventStatuses(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.updateEventStatuses();

      res.status(200).json({
        success: true,
        message: "Event statuses updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get event statistics
   */
  async getEventStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const statistics = await eventService.getEventStatistics();

      res.status(200).json({
        success: true,
        message: "Event statistics retrieved successfully",
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get admin event statistics (for admin dashboard)
   */
  async getAdminEventStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await eventService.getAdminEventStats();

      res.status(200).json({
        success: true,
        message: "Admin event statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all events for admin with advanced filtering
   */
  async getAllEventsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const query: IEventQuery = {
        status: req.query.status as EventStatus,
        city: req.query.city as string,
        startDate: req.query.startDate
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: req.query.endDate
          ? new Date(req.query.endDate as string)
          : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: req.query.sortBy as string || "createdAt",
        sortOrder: req.query.sortOrder as "asc" | "desc" || "desc",
      };

      const result = await eventService.getAllEventsAdmin(query);

      res.status(200).json({
        success: true,
        message: "Admin events retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Advanced search events for admin
   */
  async searchEventsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q: searchTerm,
        startDate,
        city,
        status,
        page = 1,
        limit = 10,
      } = req.query;

      const searchParams = {
        searchTerm: searchTerm as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        city: city as string,
        status: status as EventStatus,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await eventService.searchEventsAdmin(searchParams);

      res.status(200).json({
        success: true,
        message: "Admin search results retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clone an existing event
   */
  async cloneEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const createdBy = (req as any).user?.id || req.body.createdBy;

      if (!createdBy) {
        throw new AppError("Creator information is required", 400);
      }

      const clonedEvent = await eventService.cloneEvent(eventId, createdBy);

      if (!clonedEvent) {
        throw new AppError("Event not found", 404);
      }

      res.status(201).json({
        success: true,
        message: "Event cloned successfully",
        data: clonedEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create blank event for admin
   */
  async createBlankEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const createdBy = (req as any).user?.id || req.body.createdBy;

      if (!createdBy) {
        throw new AppError("Creator information is required", 400);
      }

      const blankEvent = await eventService.createBlankEvent(createdBy);

      res.status(201).json({
        success: true,
        message: "Blank event created successfully",
        data: blankEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search addresses for event location autocomplete
   */
  async searchAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const { q: query } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      if (query.trim().length < 3) {
        res.status(400).json({
          success: false,
          message: "Search query must be at least 3 characters long",
        });
        return;
      }

      const addresses = await addressSearchService.searchAddresses(query);

      res.status(200).json({
        success: true,
        message: "Address suggestions retrieved successfully",
        data: addresses,
      });
    } catch (error: any) {
      console.error('Address search error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch address suggestions",
        error: error.message,
      });
    }
  }
}

// Export controller instance
export const eventController = new EventController();
