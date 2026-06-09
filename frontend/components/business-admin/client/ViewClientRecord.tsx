"use client";

import clsx from "clsx";
import Image from "next/image";
import {
  X,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Users2,
} from "lucide-react";
import { useClientById } from "@/hooks/business-admin/client-management/getClientDataById";

type ViewClientModalProps = {
  clientId: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewClientRecord({
  clientId,
  open,
  onClose,
  size = "lg",
}: ViewClientModalProps) {
  const { data, isLoading, isError } = useClientById(clientId);

  const client = data?.data ?? data;

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
          Failed to load client details
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">No client found</div>
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
            Client Details -{" "}
            <span className="italic text-red-500 text-sm font-medium">
              {client.userName}
            </span>
          </h2>

          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
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
                  src={client.profile || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPCfcvp9e7k8T4Wi3kZ0wyY5EeA1BOsEqp3Uqmn79ww&s"}
                  alt={client.userName}
                  width={32}
                  height={32}
                  fill
                  className="object-cover"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={<User size={16} />}
                  label="Full Name"
                  value={client.userName}
                />

                <InfoCard
                  icon={<Mail size={16} />}
                  label="Email Address"
                  value={client.userEmail}
                />

                <InfoCard
                  icon={<Phone size={16} />}
                  label="Phone Number"
                  value={client.userPhone}
                />

                <InfoCard
                  icon={<Users2 size={16} />}
                  label="Associated Business Name"
                  value={client.businessName || "N/A"}
                />

                <InfoCard
                  icon={<ShieldCheck size={16} />}
                  label="Role"
                  value={client.role? client.role.toUpperCase() : "N/A"}
                />

                <InfoCard
                  icon={<User size={16} />}
                  label="Gender"
                  value={client.gender? client.gender.toUpperCase() : "N/A"}
                />

                <InfoCard
                  icon={<Calendar size={16} />}
                  label="Joint At"
                  value={new Date(client.createdAt).toDateString()}
                />
              </div>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div>
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
              Uploaded Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DocumentImageCard title="Citizenship" url={client.citizenship || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s"} />

              <DocumentImageCard title="License" url={client.license || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s"} />

              <DocumentImageCard title="Certificate" url={client.certificate || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s"} />
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

/* DOCUMENT CARD */
function DocumentImageCard({ title, url }: { title: string; url?: string }) {
  return (
    <div className="border border-gray-100 bg-gray-50 rounded-xl overflow-hidden shadow-sm">
      {/* IMAGE */}
      <div className="relative w-full h-56 bg-gray-100">
        {url ? (
          <Image src={url} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image Uploaded
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        <div>
          <p className="font-semibold text-gray-800">{title}</p>

          <p className="text-xs text-gray-400 mt-1 break-all line-clamp-2">
            {url || "No image available"}
          </p>
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-red-500 hover:underline"
          >
            View Full Image
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
