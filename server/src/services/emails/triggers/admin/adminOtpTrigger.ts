import { EmailService } from "../../EmailService";
import { emailVerificationOtp } from "../../templates/admin/auth/emailVerificationOtp";

export const adminOtpTrigger = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<void> => {
  const emailService = EmailService.getInstance();

  const { subject, html } = emailVerificationOtp(email, otp);

  await emailService.sendEmail({
    to: email,
    subject,
    html,
  });
};
export default adminOtpTrigger;
