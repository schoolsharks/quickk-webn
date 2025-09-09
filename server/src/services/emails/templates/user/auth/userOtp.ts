export const userOtp = (email: string, otp: string) => {
  const subject = "Login OTP";
  const html = `
    <p>Hi,</p>
    <p>Your One-Time Password (OTP) for login is:</p>
    <h2 style="font-size: 1.5em;">${otp}</h2>
    <p>Please enter this OTP to log in to your account. This code will expire in 10 minutes for your security.</p>
    <p>If you did not request this, you can safely ignore this email.</p>   
    <p>Best regards,<br/>The Team</p>
    `;
  return { subject, html };
};
