export const welcomeTemplate = ({
  businessName,
  operatorName,
  operatorEmail,
  setupLink,
}: {
  businessName: string;
  operatorName: string;
  operatorEmail: string;
  setupLink: string;
}) => {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f4f7fb;
    padding: 40px 20px;
  ">
    <div style="
      max-width: 650px;
      margin: auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    ">

      <div style="
        background: linear-gradient(135deg, #111827, #374151);
        padding: 30px;
        text-align: center;
      ">
        <h1 style="
          color: white;
          margin: 0;
          font-size: 28px;
        ">
          Welcome to FlowDesk
        </h1>

        <p style="
          color: #d1d5db;
          margin-top: 10px;
          font-size: 14px;
        ">
          Business Management Platform
        </p>
      </div>

      <div style="
        padding: 40px;
        color: #374151;
      ">
        <h2 style="
          font-size: 20px;
          margin-top: 0;
          margin-bottom: 15px;
          color: #111827;
        ">
          Complete Your Account Setup
        </h2>

        <p style="
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px 0;
          color: #555;
        ">
          Hello <strong>${operatorName}</strong>,
        </p>

        <p style="
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 25px 0;
          color: #555;
        ">
          Your business account <strong>${businessName}</strong> has been successfully created. 
          To complete your setup and set your password, please click the button below.
        </p>

        <p style="
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 30px 0;
          color: #555;
        ">
          This link is secure and can only be used once. It will expire in 24 hours for security purposes.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${setupLink}" style="
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          ">
            Setup Your Password
          </a>
        </div>

        <p style="
          font-size: 12px;
          line-height: 1.6;
          margin: 30px 0 0 0;
          color: #999;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        ">
          If the button above doesn't work, copy and paste this link in your browser:
          <br/>
          <span style="word-break: break-all; color: #3b82f6;">
            ${setupLink}
          </span>
        </p>

        <p style="
          font-size: 12px;
          margin: 15px 0 0 0;
          color: #999;
        ">
          If you didn't request this, please ignore this email.
        </p>
      </div>

      <div style="
        background-color: #f9fafb;
        padding: 20px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      ">
        <p style="
          font-size: 12px;
          margin: 0;
          color: #6b7280;
        ">
          © 2024 FlowDesk. All rights reserved.
        </p>
      </div>
    </div>
  </div>
  `;
};
