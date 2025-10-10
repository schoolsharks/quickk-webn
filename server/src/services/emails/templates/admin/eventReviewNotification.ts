export const eventReviewNotificationTemplate = (
  adminName: string,
  eventTitle: string,
  eventId: string,
  submittedBy: string
) => {
  const subject = "New Event Awaiting Review";
  
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  const reviewUrl = `${FRONTEND_URL}/admin/events/${eventId}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Review Notification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      Event Review Required
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hello ${adminName},
                    </p>

                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      A new event has been submitted by <strong>${submittedBy}</strong> for your review and approval.
                    </p>

                    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #333333; font-size: 16px; margin: 0; font-weight: bold;">
                        Event Title:
                      </p>
                      <p style="color: #667eea; font-size: 18px; margin: 10px 0 0 0; font-weight: bold;">
                        ${eventTitle}
                      </p>
                    </div>

                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                      Please review this event and publish it if it meets all requirements.
                    </p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${reviewUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                            Review Event
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${reviewUrl}" style="color: #667eea; text-decoration: none;">${reviewUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.6;">
                      This is an automated notification from your Event Management System.<br>
                      Please do not reply to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
  
  return { subject, html };
};
