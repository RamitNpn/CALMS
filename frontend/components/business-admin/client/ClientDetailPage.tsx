"use client";

import Image from "next/image";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ActivitySquare,
  BadgeCheck,
  CalendarDays,
  Download,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users2,
} from "lucide-react";
import { toPng } from "html-to-image";

import DetailTabNavigation from "@/components/business-admin/shared/DetailTabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import { useAllAttendances } from "@/hooks/business-admin/attendance-management/getAllAttendances";
import { useClientById } from "@/hooks/business-admin/client-management/getClientDataById";
import { TBilling } from "@/libs/types/billing.types";

type ClientRecord = {
  _id: string;
  business_id?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  gender?: string;
  profile?: string;
  citizenship?: string;
  license?: string;
  certificate?: string;
  role?: string;
  businessName?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  clientId: string;
};

const tabs = [
  { id: "profile", label: "Profile Records", icon: <User size={16} /> },
  {
    id: "certification",
    label: "User Certification",
    icon: <BadgeCheck size={16} />,
  },
  {
    id: "attendance",
    label: "Attendance Records",
    icon: <CalendarDays size={16} />,
  },
  { id: "logs", label: "User Logs", icon: <ActivitySquare size={16} /> },
];

export default function ClientDetailPage({ clientId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError } = useClientById(clientId);
  const client = (data?.data ?? data) as ClientRecord | undefined;

  const { data: attendanceData, isLoading: isAttendanceLoading } = useAllAttendances({
    page: 1,
    limit: 1000,
  });

  const attendances = useMemo(() => {
    const records = (attendanceData?.data ?? attendanceData ?? []) as any[];

    if (!client) return records;

    const clientName = normalize(client.userName);
    const clientEmail = normalize(client.userEmail);

    return records.filter((att) => {
      const aName = normalize(att.clientName);
      const aEmail = normalize(att.clientEmail);

      return (
        (clientName && aName.includes(clientName)) ||
        (clientEmail && aEmail.includes(clientEmail))
      );
    });
  }, [attendanceData, client]);

  const handleExportCertificate = async () => {
    if (!certificateRef.current || isExporting) return;

    try {
      setIsExporting(true);

      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        backgroundColor: "#fcfcfc",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${client.userName || "client"}-certificate.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <DetailSkeleton title="Client Details" />;
  }

  if (isError || !client) {
    return (
      <DetailError
        title="Client Details"
        message="Failed to load client details"
        onBack={() => router.push("/pages/dashboard/business-admin/clients")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/pages/dashboard/business-admin/clients")}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to Client Management
        </button>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Client Detail View
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {client.userName || "Client"}
          </h1>
        </div>
      </div>

      <DetailTabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {activeTab === "profile" && (
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-8 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-lg">
                  <Image
                    src={client.profile || FALLBACK_PROFILE}
                    alt={client.userName || "Client profile"}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                    Profile Records
                  </p>
                  <h2 className="mt-1 text-3xl font-semibold">
                    {client.userName || "Client"}
                  </h2>
                  <p className="mt-2 text-white/75">
                    Business client account overview and document summary
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
                <MetricCard label="Role" value={client.role || "client"} />
                <MetricCard label="Gender" value={client.gender || "N/A"} />
                <MetricCard label="Created" value={formatDate(client.createdAt)} />
                <MetricCard label="Updated" value={formatDate(client.updatedAt)} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard icon={<User size={16} />} label="Full Name" value={client.userName} />
            <InfoCard icon={<Mail size={16} />} label="Email Address" value={client.userEmail} />
            <InfoCard icon={<Phone size={16} />} label="Phone Number" value={client.userPhone} />
            <InfoCard icon={<Users2 size={16} />} label="Business Name" value={client.businessName || "N/A"} />
            <InfoCard icon={<ShieldCheck size={16} />} label="Role" value={client.role || "client"} />
            <InfoCard icon={<CalendarDays size={16} />} label="Joined On" value={formatDate(client.createdAt)} />
          </div>
        </section>
      )}

      {activeTab === "certification" && (
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                User Certification
              </p>
              <h2 className="mt-1 text-xl font-semibold text-gray-900">
                {client.userName || "Client"}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleExportCertificate}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 self-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <Download size={16} />
              {isExporting ? "Exporting..." : "Export Certificate"}
            </button>
          </div>

          <div className="bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-[760px] justify-center">
              <div
                ref={certificateRef}
                className="w-full max-w-[760px] rounded-[14px] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-black/5"
              >
                <div className="relative bg-[#fcfcfc] px-8 py-10 sm:px-12 sm:py-12">
                  <div className="mx-auto flex max-w-[520px] flex-col items-center text-center text-[#2d2d2d]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#7bbd2a] text-[#7bbd2a] shadow-sm">
                        <BadgeCheck size={26} strokeWidth={2.2} />
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-[#84a92d]">
                        Driving Logo
                      </p>
                    </div>

                    <div className="mt-6 space-y-5 font-serif">
                      <p className="text-[16px] font-semibold uppercase tracking-[0.26em] text-[#2f2f2f] sm:text-[20px]">
                        Certification of Completion
                      </p>

                      <p className="text-[13px] text-[#5c5c5c] sm:text-[15px]">
                        This is to certify that
                      </p>

                      <div className="space-y-1">
                        <p className="text-[28px] font-semibold leading-tight text-[#565656] sm:text-[38px]">
                          {client.userName || "Client Name"}
                        </p>
                        <p className="text-[12px] text-[#666666] sm:text-[13px]">
                          {client.role || "Client"}
                          {client.businessName ? `, ${client.businessName}` : ""}
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <p className="text-[13px] text-[#5b5b5b] sm:text-[15px]">
                          Has completed his/her training course
                        </p>
                        <p className="text-[18px] font-semibold uppercase tracking-[0.2em] text-[#333333] sm:text-[22px]">
                          Business Certification
                        </p>
                      </div>

                      <div className="space-y-1 pt-1">
                        <p className="text-[13px] text-[#5d5d5d] sm:text-[15px]">
                          From the institute
                        </p>
                        <p className="text-[16px] font-medium text-[#333333] sm:text-[20px]">
                          {client.businessName || "Global Business Institute"}
                        </p>
                      </div>

                      <div className="space-y-1 pt-2">
                        <p className="text-[13px] text-[#5b5b5b] sm:text-[15px]">
                          By Date
                        </p>
                        <p className="text-[11px] tracking-[0.16em] text-[#666666] sm:text-[13px]">
                          {client.createdAt ? moment(client.createdAt).format("DD MMMM YYYY") : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 w-full border-t border-[#d8d8d8] pt-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                          Authorized Signature
                        </p>
                        <p
                          className="text-[24px] leading-none text-[#2b2b2b] sm:text-[30px]"
                          style={{
                            fontFamily:
                              '"Brush Script MT", "Segoe Script", "Snell Roundhand", cursive',
                          }}
                        >
                          Bijay Sharma
                        </p>
                        <p className="text-[12px] font-semibold text-[#3a3a3a] sm:text-[14px]">
                          Mr. Bijay Sharma
                        </p>
                        <p className="text-[10px] text-[#666666] sm:text-[11px]">
                          Head of the department
                        </p>
                        <p className="pt-1 text-[10px] text-[#787878] sm:text-[11px]">
                          Estd: 2020/02/23
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "attendance" && (
        <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Attendance Records</h2>
              <p className="text-sm text-gray-500">Attendance records linked to {client.userName || "this client"}</p>
            </div>
          </div>

          {isAttendanceLoading ? (
            <EmptyState icon={<CalendarDays size={22} />} title="Loading attendances..." description="Fetching attendance records for this client" />
          ) : attendances.length === 0 ? (
            <EmptyState icon={<CalendarDays size={22} />} title="No attendances found" description="No attendance records match this client yet" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">SN</th>
                      <th className="px-4 py-3 font-semibold">Client</th>
                      <th className="px-4 py-3 font-semibold">Check In</th>
                      <th className="px-4 py-3 font-semibold">Check Out</th>
                      <th className="px-4 py-3 font-semibold">Method</th>
                      <th className="px-4 py-3 font-semibold">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {attendances.map((att, index) => (
                      <tr key={att._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-700">{index + 1}</td>
                        <td className="px-4 py-4 font-medium text-gray-900">
                          <div className="flex flex-col">
                            <span>{att.clientName}</span>
                            <span className="text-xs text-gray-500">{att.clientEmail}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-700">{att.checkIn ? moment(att.checkIn).format("lll") : "-"}</td>
                        <td className="px-4 py-4 text-gray-700">{att.checkOut ? moment(att.checkOut).format("lll") : "-"}</td>
                        <td className="px-4 py-4 text-gray-700">{att.method || "-"}</td>
                        <td className="px-4 py-4 text-gray-700">{att.createdAt ? moment(att.createdAt).format("lll") : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "logs" && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <LogDetails
            module="Clients"
            recordId={client._id}
            recordName={client.userName}
            onClearLogs={() => {
              console.log("Clearing client logs for", client._id);
            }}
          />
        </section>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 break-all text-base font-semibold text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}


function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
      <div className="rounded-2xl bg-white p-4 text-gray-400 shadow-sm">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
}

function DetailSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <div className="h-11 w-52 rounded-xl bg-gray-200" />
        <div className="h-10 w-48 rounded-xl bg-gray-200" />
      </div>
      <div className="h-14 rounded-2xl bg-gray-200" />
      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <div className="h-64 rounded-3xl bg-gray-100" />
      </div>
      <p className="text-sm text-gray-500">Loading {title.toLowerCase()}...</p>
    </div>
  );
}

function DetailError({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm">{message}</p>
      </div>
    </div>
  );
}

function normalize(value?: string) {
  return value?.trim().toLowerCase() || "";
}

function formatDate(value?: string) {
  return value ? moment(value).format("ll") : "-";
}



const FALLBACK_PROFILE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPCfcvp9e7k8T4Wi3kZ0wyY5EeA1BOsEqp3Uqmn79ww&s";

const FALLBACK_CERTIFICATE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s";