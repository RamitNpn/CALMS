export const subscriptionRenewalTemplate = ({
  businessName,
  operatorName,
  packageName,
  startedAt,
  endAt,
  paidAmount,
  dueAmount,
  paymentStatus,
  loginUrl,
}: {
  businessName: string;
  operatorName: string;
  packageName: string;
  startedAt: string;
  endAt: string;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
  loginUrl: string;
}) => {
  return `
  <div style="
    background-color: #f4f7fb;
    padding: 40px 20px;
    font-family: Arial, sans-serif;
  ">
    <div style="
      max-width: 680px;
      margin: auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 6px 24px rgba(0,0,0,0.08);
    ">

      <div style="
        background: linear-gradient(135deg, #111827, #1f2937);
        padding: 35px;
        text-align: center;
      ">
        <h1 style="
          color: white;
          margin: 0;
          font-size: 30px;
        ">
          Subscription Renewed
        </h1>

        <p style="
          margin-top: 10px;
          color: #d1d5db;
          font-size: 14px;
        ">
          Your FlowDesk subscription has been successfully extended.
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
          line-height: 1.8;
          font-size: 15px;
        ">
          We are happy to inform you that your business subscription
          has been successfully renewed and your account remains active.
        </p>

        <div style="
          margin-top: 25px;
          padding: 18px;
          border-radius: 10px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        ">
          <p style="
            margin: 0;
            color: #065f46;
            font-weight: bold;
            font-size: 15px;
          ">
            Renewal Successful
          </p>
        </div>

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
              Subscription Details
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
                  padding: 12px 0;
                  font-weight: bold;
                  color: #6b7280;
                  width: 180px;
                ">
                  Business Name:
                </td>

                <td style="
                  padding: 12px 0;
                  color: #111827;
                ">
                  ${businessName}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 12px 0;
                  font-weight: bold;
                  color: #6b7280;
                ">
                  Package:
                </td>

                <td style="
                  padding: 12px 0;
                  text-transform: capitalize;
                  color: #111827;
                ">
                  ${packageName}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 12px 0;
                  font-weight: bold;
                  color: #6b7280;
                ">
                  Subscription Start:
                </td>

                <td style="
                  padding: 12px 0;
                  color: #111827;
                ">
                  ${startedAt}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 12px 0;
                  font-weight: bold;
                  color: #6b7280;
                ">
                  Subscription End:
                </td>

                <td style="
                  padding: 12px 0;
                  color: #dc2626;
                  font-weight: bold;
                ">
                  ${endAt}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 12px 0;
                  font-weight: bold;
                  color: #6b7280;
                ">
                  Paid Amount:
                </td>

                <td style="
                  padding: 12px 0;
                  color: #111827;
                ">
                  Rs. ${paidAmount}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 12px 0;
                  font-weight: bold;
                  color: #6b7280;
                ">
                  Due Amount:
                </td>

                <td style="
                  padding: 12px 0;
                  color: #111827;
                ">
                  Rs. ${dueAmount}
                </td>
              </tr>

              <tr>
                <td style="
                  padding: 12px 0;
                  font-weight: bold;
                  color: #6b7280;
                ">
                  Payment Status:
                </td>

                <td style="
                  padding: 12px 0;
                  text-transform: capitalize;
                  font-weight: bold;
                  color: ${
                    paymentStatus === "paid"
                      ? "#16a34a"
                      : paymentStatus === "partial"
                      ? "#d97706"
                      : "#dc2626"
                  };
                ">
                  ${paymentStatus}
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
              font-size: 14px;
              font-weight: bold;
            "
          >
            Access Dashboard
          </a>
        </div>

        <div style="
          margin-top: 35px;
          padding: 18px;
          background: #f9fafb;
          border-radius: 10px;
        ">
          <p style="
            margin: 0;
            color: #4b5563;
            line-height: 1.7;
            font-size: 14px;
          ">
            Thank you for continuing to use FlowDesk. We appreciate your
            trust in our platform and remain committed to helping you manage
            your business efficiently.
          </p>
        </div>

      </div>

      <div style="
        padding: 20px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        text-align: center;
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
