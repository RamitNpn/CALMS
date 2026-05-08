"use staff";

import clsx from "clsx";
import Image from "next/image";
import {
  X,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Calendar,
  Users2,
} from "lucide-react";
import { useStaffById } from "@/hooks/business-admin/staff-management/getStaffDataById";

type ViewStaffModalProps = {
  staffId: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewStaffRecord({
  staffId,
  open,
  onClose,
  size = "lg",
}: ViewStaffModalProps) {
  const { data, isLoading, isError } = useStaffById(staffId);

  const staff = data?.data ?? data;

  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-red-500">
          Failed to load staff details
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">No staff found</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full overflow-y-auto max-h-[95vh]",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-4xl": size === "lg",
            "max-w-6xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-100 sticky top-0 z-10">
          <h2 className="text-lg font-semibold">
            staff Details -{" "}
            <span className="italic text-red-500 text-sm font-medium">
              {staff.userName}
            </span>
          </h2>

          <button onClick={onClose}>
            <X className="text-red-500 cursor-pointer" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* IMAGE */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={staff.profile}
                  alt={staff.userName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={<User size={16} />}
                  label="Full Name"
                  value={staff.userName}
                />

                <InfoCard
                  icon={<Mail size={16} />}
                  label="Email Address"
                  value={staff.userEmail}
                />

                <InfoCard
                  icon={<Phone size={16} />}
                  label="Phone Number"
                  value={staff.userPhone}
                />

                <InfoCard
                  icon={<Users2 size={16} />}
                  label="Associated Business Name"
                  value={staff.businessName || "N/A"}
                />

                <InfoCard
                  icon={<ShieldCheck size={16} />}
                  label="Role"
                  value={staff.role? staff.role.toUpperCase() : "N/A"}
                />

                <InfoCard
                  icon={<User size={16} />}
                  label="Gender"
                  value={staff.gender? staff.gender.toUpperCase() : "N/A"}
                />

                <InfoCard
                  icon={<Calendar size={16} />}
                  label="Joint At"
                  value={new Date(staff.createdAt).toDateString()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* INFO CARD */
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
    <div className="bg-white border border-gray-100 rounded-lg p-4">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {icon}
        <span>{label}</span>
      </div>

      <p className="mt-2 text-gray-800 font-medium break-all">{value || "-"}</p>
    </div>
  );
}
