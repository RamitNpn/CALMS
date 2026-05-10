export const businessRegistrationTemplate = ({
  businessName,
  operatorName,
  operatorEmail,
  password,
  packageName,
  loginUrl,
}: {
  businessName: string;
  operatorName: string;
  operatorEmail: string;
  password: string;
  packageName: string;
  loginUrl: string;
}) => {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f4f7fb;
    padding: 40px 20px;
  ">
    <div style="
      max-width: 650px;s
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

      <div style="padding: 35px;">

        <h2 style="
          color: #111827;
          margin-bottom: 10px;
        ">
          Hello ${operatorName},
        </h2>

        <p style="
          color: #4b5563;
          line-height: 1.7;
          font-size: 15px;
        ">
          Your business account has been successfully created on
          <strong>FlowDesk</strong>.
        </p>

        <div style="
          margin-top: 25px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        ">

          <div style="
            background: #f9fafb;
            padding: 15px 20px;
            border-bottom: 1px solid #e5e7eb;
          ">
            <h3 style="
              margin: 0;
              color: #111827;
              font-size: 16px;
            ">
              Account Details
            </h3>
          </div>

          <div style="padding: 20px;">

            <table style="
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            ">
              <tr>
                <td style="
                  padding: 10px 0;
                  color: #6b7280;
                  font-weight: bold;
                  width: 160px;
                ">
                  Business Name:
                </td>

                <td style="
                  padding: 10px 0;
                  color: #111827;
                ">
                  ${businessName}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 10px 0;
                  color: #6b7280;
                  font-weight: bold;
                ">
                  Email:
                </td>

                <td style="
                  padding: 10px 0;
                  color: #111827;
                ">
                  ${operatorEmail}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 10px 0;
                  color: #6b7280;
                  font-weight: bold;
                ">
                  Password:
                </td>

                <td style="
                  padding: 10px 0;
                  color: #dc2626;
                  font-weight: bold;
                ">
                  ${password}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 10px 0;
                  color: #6b7280;
                  font-weight: bold;
                ">
                  Package:
                </td>

                <td style="
                  padding: 10px 0;
                  color: #111827;
                  text-transform: capitalize;
                ">
                  ${packageName}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div style="
          text-align: center;
          margin-top: 35px;
        ">
          <a
            href="${loginUrl}"
            style="
              display: inline-block;
              background: #111827;
              color: white;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 8px;
              font-weight: bold;
              font-size: 14px;
            "
          >
            Login to Dashboard
          </a>
        </div>

        <div style="
          margin-top: 30px;
          padding: 16px;
          background: #fef3c7;
          border-radius: 8px;
        ">
          <p style="
            margin: 0;
            color: #92400e;
            font-size: 13px;
            line-height: 1.6;
          ">
            For security reasons, we strongly recommend changing your
            password after your first login.
          </p>
        </div>

      </div>

      <div style="
        background: #f9fafb;
        padding: 20px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      ">
        <p style="
          margin: 0;
          color: #6b7280;
          font-size: 13px;
        ">
          © ${new Date().getFullYear()} FlowDesk. All rights reserved.
        </p>
      </div>

    </div>
  </div>
  `;
};
