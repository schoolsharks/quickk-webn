/**
 * Event Status Cron Job
 * Automatically updates event statuses based on dates
 * 
 * Schedule: Runs daily at midnight (00:00)
 * - UPCOMING: startDate > today
 * - ACTIVE: startDate <= today AND endDate >= today
 * - PAST: endDate < today
 * 
 * Note: DRAFT and PENDING_REVIEW events are excluded from auto-updates
 */

import cron from 'node-cron';
import { Event } from '../models/events.model';
import { eventLogger } from '../utils/eventLogger';

/**
 * Initialize and start the event status update cron job
 */
export const startEventStatusCron = (): void => {
  // Schedule: Run every day at midnight (00:00)
  // Cron format: second minute hour day month weekday
  // '0 0 * * *' = At 00:00 (midnight) every day
  
  const cronSchedule = '0 0 * * *'; // Daily at midnight
  
  const job = cron.schedule(cronSchedule, async () => {
    try {
      eventLogger.info('Event status cron job triggered');
      await (Event as any).updateEventStatuses();
    } catch (error) {
      eventLogger.error('Event status cron job failed', error);
    }
  }, {
    scheduled: true,
    timezone: process.env.TIMEZONE || 'Asia/Kolkata' // Default to IST, can be configured via env
  });

  job.start();
  eventLogger.success('Event status cron job initialized', { 
    schedule: cronSchedule,
    timezone: process.env.TIMEZONE || 'Asia/Kolkata',
    nextRun: 'Daily at 00:00'
  });
};

/**
 * Run event status update immediately (useful for server startup)
 */
export const runEventStatusUpdateNow = async (): Promise<void> => {
  try {
    eventLogger.info('Running event status update on server startup');
    await (Event as any).updateEventStatuses();
  } catch (error) {
    eventLogger.error('Failed to update event statuses on startup', error);
  }
};

/**
 * Initialize event status automation
 * - Starts the cron job
 * - Optionally runs an immediate update on startup
 */
export const initializeEventStatusAutomation = async (): Promise<void> => {
  // Run immediate update on server startup
  await runEventStatusUpdateNow();
  
  // Start the scheduled cron job
  startEventStatusCron();
};
