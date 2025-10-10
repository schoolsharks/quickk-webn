import { EmailService } from "../../EmailService";
import { dailyPulseReviewNotification } from "../../templates/admin/dailyPulseReviewNotification";

export const dailyPulseReviewTrigger = async ({
  adminEmails,
  publishDate,
  pulseCount,
  dailyPulseId,
  submittedBy,
}: {
  adminEmails: string[];
  publishDate: string;
  pulseCount: number;
  dailyPulseId: string;
  submittedBy: string;
}): Promise<void> => {
  const emailService = EmailService.getInstance();

  // Send email to each super admin
  for (const email of adminEmails) {
    try {
      // Extract admin name from email (e.g., john.doe@example.com -> John Doe)
      const adminName = email.split('@')[0].split('.').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');

      const { subject, html } = dailyPulseReviewNotification(
        adminName,
        publishDate,
        pulseCount,
        dailyPulseId,
        submittedBy
      );

      await emailService.sendEmail({
        to: email,
        subject,
        html,
      });

      console.log(`Daily Pulse review notification sent to: ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      // Continue sending to other admins even if one fails
    }
  }
};

export default dailyPulseReviewTrigger;
