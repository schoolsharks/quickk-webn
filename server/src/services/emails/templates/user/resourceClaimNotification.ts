export const resourceClaimNotificationTemplate = (
  companyName: string,
  resourceTitle: string,
  userName: string,
  userEmail: string,
  userInput: string,
  claimDate: string
) => {
  const subject = `New Claim for Your Resource: ${resourceTitle}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resource Claim Notification</title>
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
                      New Resource Claim
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hello ${companyName},
                    </p>

                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Great news! A user has claimed your resource on our platform.
                    </p>

                    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #333333; font-size: 16px; margin: 0; font-weight: bold;">
                        Resource:
                      </p>
                      <p style="color: #667eea; font-size: 18px; margin: 10px 0 0 0; font-weight: bold;">
                        ${resourceTitle}
                      </p>
                    </div>

                    <!-- User Details -->
                    <div style="background-color: #ffffff; border: 1px solid #e9ecef; padding: 20px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #333333; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">
                        User Details:
                      </p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 120px;">
                            Name:
                          </td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 500;">
                            ${userName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                            Email:
                          </td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 500;">
                            <a href="mailto:${userEmail}" style="color: #667eea; text-decoration: none;">
                              ${userEmail}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                            Claim Date:
                          </td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 500;">
                            ${claimDate}
                          </td>
                        </tr>
                      </table>
                    </div>

                    ${userInput ? `
                    <!-- User Message -->
                    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 4px;">
                      <p style="color: #333333; font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">
                        Message from User:
                      </p>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
                        ${userInput}
                      </p>
                    </div>
                    ` : ''}

                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                      Please reach out to the user directly using the contact information provided above to coordinate the next steps.
                    </p>

                    <!-- Contact Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="mailto:${userEmail}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                            Contact User
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.6;">
                      This is an automated notification from Quickk.<br>
                      Please do not reply to this email. Contact the user directly at their provided email address.
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
