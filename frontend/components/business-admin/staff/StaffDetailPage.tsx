"use client";

import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ActivitySquare,
  ArrowLeft,
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users2,
} from "lucide-react";

import DetailTabNavigation from "@/components/business-admin/shared/DetailTabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import { useAllAttendances } from "@/hooks/business-admin/attendance-management/getAllAttendances";
import { useStaffById } from "@/hooks/business-admin/staff-management/getStaffDataById";
import { TAttendance } from "@/libs/types/attendance.types";

type StaffRecord = {
  _id: string;
  business_id?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  gender?: string;
  profile?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  staffId: string;
};

const tabs = [
  { id: "profile", label: "Profile Records", icon: <User size={16} /> },
  {
    id: "attendance",
    label: "Attendance Records",
    icon: <CalendarDays size={16} />,
  },
  { id: "logs", label: "User Logs", icon: <ActivitySquare size={16} /> },
];

export default function StaffDetailPage({ staffId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  const { data, isLoading, isError } = useStaffById(staffId);
  const staff = (data?.data ?? data) as StaffRecord | undefined;

  const { data: attendanceData, isLoading: isAttendanceLoading } =
    useAllAttendances({ page: 1, limit: 1000 });

  const attendanceRecords = useMemo(() => {
    const records = (attendanceData?.data ?? attendanceData ?? []) as TAttendance[];

    if (!staff) return records;

    const staffName = normalize(staff.userName);
    const staffEmail = normalize(staff.userEmail);
    const staffRole = normalize(staff.role);

    return records.filter((attendance) => {
      const attendanceName = normalize(attendance.clientName);
      const attendanceEmail = normalize(attendance.clientEmail);
      const attendanceUserType = normalize(attendance.userType);

      return (
        (staffName && attendanceName.includes(staffName)) ||
        (staffEmail && attendanceEmail.includes(staffEmail)) ||
        (staffRole && attendanceUserType.includes(staffRole))
      );
    });
  }, [attendanceData, staff]);

  const attendanceSummary = useMemo(() => {
    const total = attendanceRecords.length;
    const completed = attendanceRecords.filter(
      (record) => record.checkIn && record.checkOut,
    ).length;
    const active = attendanceRecords.filter(
      (record) => record.checkIn && !record.checkOut,
    ).length;

    return { total, completed, active };
  }, [attendanceRecords]);

  if (isLoading) {
    return <DetailSkeleton title="Staff Details" />;
  }

  if (isError || !staff) {
    return (
      <DetailError
        title="Staff Details"
        message="Failed to load staff details"
        onBack={() => router.push("/pages/dashboard/business-admin/staff")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/pages/dashboard/business-admin/staff")}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to Staff Management
        </button>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Staff Detail View
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {staff.userName || "Staff"}
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
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 px-6 py-8 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-lg">
                  <Image
                    src={staff.profile || FALLBACK_PROFILE}
                    alt={staff.userName || "Staff profile"}
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
                    {staff.userName || "Staff"}
                  </h2>
                  <p className="mt-2 text-white/75">
                    Staff profile overview and access history
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
                <MetricCard label="Role" value={staff.role || "staff"} />
                <MetricCard label="Gender" value={staff.gender || "N/A"} />
                <MetricCard label="Created" value={formatDate(staff.createdAt)} />
                <MetricCard label="Updated" value={formatDate(staff.updatedAt)} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard icon={<User size={16} />} label="Full Name" value={staff.userName} />
            <InfoCard icon={<Mail size={16} />} label="Email Address" value={staff.userEmail} />
            <InfoCard icon={<Phone size={16} />} label="Phone Number" value={staff.userPhone} />
            <InfoCard icon={<Users2 size={16} />} label="Business ID" value={staff.business_id || "N/A"} />
            <InfoCard icon={<ShieldCheck size={16} />} label="Role" value={staff.role || "staff"} />
            <InfoCard icon={<CalendarDays size={16} />} label="Joined On" value={formatDate(staff.createdAt)} />
          </div>
        </section>
      )}

      {activeTab === "attendance" && (
        <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Attendance Records
              </h2>
              <p className="text-sm text-gray-500">
                Attendance activity linked to {staff.userName || "this staff member"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <SummaryTile label="Total" value={`${attendanceSummary.total}`} />
              <SummaryTile label="Completed" value={`${attendanceSummary.completed}`} />
              <SummaryTile label="Open" value={`${attendanceSummary.active}`} />
            </div>
          </div>

          {isAttendanceLoading ? (
            <EmptyState icon={<CalendarDays size={22} />} title="Loading attendance..." description="Fetching attendance records for this staff member" />
          ) : attendanceRecords.length === 0 ? (
            <EmptyState icon={<CalendarDays size={22} />} title="No attendance found" description="No attendance records match this staff member yet" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">SN</th>
                      <th className="px-4 py-3 font-semibold">Client Name</th>
                      <th className="px-4 py-3 font-semibold">Client Email</th>
                      <th className="px-4 py-3 font-semibold">User Type</th>
                      <th className="px-4 py-3 font-semibold">Method</th>
                      <th className="px-4 py-3 font-semibold">Check In</th>
                      <th className="px-4 py-3 font-semibold">Check Out</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {attendanceRecords.map((record, index) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-700">{index + 1}</td>
                        <td className="px-4 py-4 font-medium text-gray-900">
                          {record.clientName}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {record.clientEmail}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {record.userType}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          <span className={methodClass(record.method)}>
                            {record.method}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {record.checkIn ? moment(record.checkIn).format("lll") : "-"}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {record.checkOut ? moment(record.checkOut).format("lll") : "-"}
                        </td>
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
            module="Staff"
            recordId={staff._id}
            recordName={staff.userName}
            onClearLogs={() => {
              console.log("Clearing staff logs for", staff._id);
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

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-right shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
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

function methodClass(method?: string) {
  const base = "inline-flex rounded-full px-3 py-1 text-xs font-semibold";
  return method === "QR"
    ? `${base} bg-emerald-100 text-emerald-700`
    : `${base} bg-sky-100 text-sky-700`;
}

const FALLBACK_PROFILE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPCfcvp9e7k8T4Wi3kZ0wyY5EeA1BOsEqp3Uqmn79ww&s";