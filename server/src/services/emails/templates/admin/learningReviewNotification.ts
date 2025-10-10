export const learningReviewNotification = (
  adminName: string,
  publishDate: string,
  moduleCount: number,
  learningId: string,
  learningTitle: string,
  submittedBy: string
) => {
  const subject = "New Learning Module Awaiting Review";
  
  // Format the review link
  const reviewLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/learnings/create/${learningId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #CD7BFF;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #CD7BFF;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .info-box {
          background-color: #f0f0f0;
          padding: 15px;
          border-left: 4px solid #CD7BFF;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 Learning Module Review Request</h1>
        </div>
        <div class="content">
          <p>Hi ${adminName},</p>
          
          <p>A new Learning module has been submitted for your review and approval.</p>
          
          <div class="info-box">
            <p><strong>📖 Learning Title:</strong> ${learningTitle || 'Untitled Learning'}</p>
            <p><strong>📅 Scheduled Publish Date:</strong> ${publishDate}</p>
            <p><strong>📊 Number of Modules:</strong> ${moduleCount}</p>
            <p><strong>👤 Submitted By:</strong> ${submittedBy}</p>
          </div>
          
          <p>Please review the content and approve it for publishing or provide feedback for revisions.</p>
          
          <center>
            <a href="${reviewLink}" class="button">Review Learning Module</a>
          </center>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            <strong>Note:</strong> This Learning module is currently in "Pending Review" status and will not be visible to users until you approve it.
          </p>
          
          <p>If you have any questions, please contact the admin who submitted this module.</p>
          
          <p>Best regards,<br>Webn Team</p>
        </div>
        <div class="footer">
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};
