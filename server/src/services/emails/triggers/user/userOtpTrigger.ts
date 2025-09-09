import { EmailService } from "../../EmailService";
import { userOtp } from "../../templates/user/auth/userOtp";

export const userOtpTrigger = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<void> => {
  const emailService = EmailService.getInstance();

  const { subject, html } = userOtp(email, otp);

  await emailService.sendEmail({
    to: email,
    subject,
    html,
  });
};
export default userOtpTrigger;
