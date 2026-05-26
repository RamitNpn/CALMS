import { TPrintableToken } from "@/libs/types/token.types";

export default function PrintableToken({ token }: TPrintableToken) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const businessName = storedData?.businessName;

  const panNo = process.env.NEXT_PUBLIC_PAN_NO || "N/A";
  const estdDate = process.env.NEXT_PUBLIC_ESTD_DATE || "N/A";

  let status = "";

  if (token.status === "pending") {
    status = "Pending";
  } else if (token.status === "scheduled") {
    status = "Scheduled";
  } else if (token.status === "in_progress") {
    status = "In Progress";
  } else if (token.status === "completed") {
    status = "Completed";
  } else if (token.status === "cancelled") {
    status = "Cancelled";
  } else {
    status = "Failed";
  }

  return (
    <div className="bg-white p-4 rounded print:shadow-none print:p-0">
      <div
        id="print-token"
        className="
          bg-white
          text-gray-900
          border
          border-dashed
          shadow-md
          px-4
          py-2
          w-[340px]
          font-mono
          text-sm
          print:w-auto
        "
      >
        {/* HEADER */}
        <div className="text-center">
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px]">PAN No: {panNo}</p>
              <p className="text-[10px]">Estd: {estdDate}</p>
            </div>
            <h1 className="font-bold">{businessName}</h1>
            <p className="text-xs mb-2">Token Receipt</p>
          </div>
        </div>

        {/* CONTENT */}

        <div className="mt-5 space-y-3">
          <Row label="Token No" value={token.tokenNumber} />
          <Row label="Name" value={token.fullName} />
          <Row label="Phone" value={token.phone} />
          <Row label="Vehicle" value={token.vehicleCategory} />
          <Row label="Rounds" value={String(token.roundNumber)} />
          <Row label="Charge/Round" value={`Rs. ${token.perRoundCharge}`} />
          <Row label="Total" value={`Rs. ${token.totalAmount}`} />
          <Row
            label="Date"
            value={
              new Date(token.participationDate).toISOString().split("T")[0]
            }
          />
          <Row label="Status" value={status} />
        </div>

        {/* FOOTER */}

        <div className="mt-6">
          <div className="border-t border-gray-200 pt-3 text-center">
            <p className="text-xs">Generated:</p>
            <p className="text-xs">{new Date().toLocaleString()}</p>
            <p className="mt-2 text-[11px]">Thank you for choosing us.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  value: string;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-semibold">{label}:</span>

      <span className="text-right capitalize">{value}</span>
    </div>
  );
}
