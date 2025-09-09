import { EmailService } from '../../EmailService';

const UserOtpEmail = async (
    otp: string,
    email: string
) => {
    const subject = `Your OTP for WEBN Community Login`;
    const templateName = "user-otp";

    await EmailService.getInstance().sendEmail({
        to: email,
        subject,
        templateName,
        templateCategory: 'user/auth',
        variables: {
            OTP: otp
        },
    });
};

export default UserOtpEmail;
