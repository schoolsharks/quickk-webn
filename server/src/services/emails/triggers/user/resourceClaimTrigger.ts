import { EmailService } from "../../EmailService";
import { resourceClaimNotificationTemplate } from "../../templates/user/resourceClaimNotification";

export const resourceClaimTrigger = async ({
  companyEmail,
  companyName,
  resourceTitle,
  userName,
  userEmail,
  userInput,
}: {
  companyEmail: string;
  companyName: string;
  resourceTitle: string;
  userName: string;
  userEmail: string;
  userInput?: string;
}): Promise<void> => {
  const emailService = EmailService.getInstance();

  try {
    const claimDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const { subject, html } = resourceClaimNotificationTemplate(
      companyName,
      resourceTitle,
      userName,
      userEmail,
      userInput || '',
      claimDate
    );

    await emailService.sendEmail({
      to: companyEmail,
      subject,
      html,
    });

    console.log(`Resource claim notification sent to: ${companyEmail}`);
  } catch (error) {
    console.error(`Failed to send resource claim email to ${companyEmail}:`, error);
    throw error;
  }
};

export default resourceClaimTrigger;
