"use client";

import { useInquiryById } from "@/hooks/business-admin/inquery/getInquiryById";
import clsx from "clsx";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  Calendar,
} from "lucide-react";


type Props = {
  inquiryId: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewInquiryRecord({
  inquiryId,
  open,
  onClose,
  size = "lg",
}: Props) {
  const { data, isLoading } = useInquiryById(inquiryId);

  const inquiry = data?.data ?? data;

  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg">
          Loading...
        </div>
      </div>
    );
  }

  if (!inquiry) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div
        className={clsx(
          "bg-white rounded shadow-xl w-full max-h-[92vh] overflow-y-auto",
          {
            "max-w-md": size === "sm",
            "max-w-xl": size === "md",
            "max-w-4xl": size === "lg",
            "max-w-6xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex justify-between items-center bg-white border-b border-gray-200 px-5 py-3">
          <div>
            <h2 className="font-semibold text-gray-800">
              Inquiry Details
            </h2>

            <p className="text-xs text-gray-500">
              {inquiry.fullName}
            </p>
          </div>

          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5">

          {/* QUICK INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            <Info icon={<User size={14} />} label="Name" value={inquiry.fullName} />

            <Info icon={<Mail size={14} />} label="Email" value={inquiry.email} />

            <Info icon={<Phone size={14} />} label="Phone" value={inquiry.phone} />

            <Info icon={<MapPin size={14} />} label="Address" value={`${inquiry.street}, ${inquiry.district}`} />

            <Info icon={<Car size={14} />} label="License" value={inquiry.licenseType} />

            <Info icon={<Calendar size={14} />} label="Schedule" value={inquiry.preferredSchedule} />

          </div>

          {/* COURSE DETAILS */}
          <Section title="Course Details">

            <CompactGrid>

              <Info label="Inquiry Type" value={inquiry.inquiryType} />

              <Info label="Vehicle" value={inquiry.preferredVehicle} />

              <Info label="Package" value={inquiry.packageType} />

              <Info label="Shift" value={inquiry.trainingShift} />

              <Info label="Experience" value={inquiry.experienceLevel} />

              <Info label="Occupation" value={inquiry.occupation} />

            </CompactGrid>

          </Section>

          {/* EMERGENCY */}
          <Section title="Emergency Contact">

            <CompactGrid>

              <Info
                label="Name"
                value={inquiry.emergencyContact?.name}
              />

              <Info
                label="Phone"
                value={inquiry.emergencyContact?.phone}
              />

              <Info
                label="Relation"
                value={inquiry.emergencyContact?.relation}
              />

            </CompactGrid>

          </Section>

          {/* MESSAGE */}
          {inquiry.message && (
            <Section title="Message">
              <div className="bg-gray-50 rounded border-gray-200 border p-3 text-sm text-gray-700">
                {inquiry.message}
              </div>
            </Section>
          )}

          {/* FOOTER */}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 border-t border-gray-200 pt-4">

            <div>
              Created:
              <div className="text-gray-800 font-medium">
                {new Date(
                  inquiry.createdAt,
                ).toLocaleDateString()}
              </div>
            </div>

            <div>
              Terms:
              <div className="text-green-600 font-semibold">
                {inquiry.agreeTerms
                  ? "Accepted"
                  : "Not Accepted"}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

/* SMALL CARD */

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="border border-gray-200 rounded p-3 bg-gray-50">
      <div className="flex items-center gap-1 text-xs text-gray-500">
        {icon}
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-gray-800 break-words">
        {value || "-"}
      </div>
    </div>
  );
}

/* SECTION */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h3>

      {children}
    </div>
  );
}

function CompactGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {children}
    </div>
  );
}