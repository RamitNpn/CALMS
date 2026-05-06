"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import { useAssetById } from "@/hooks/business-admin/asset-management/getAssetById";
import { TAsset } from "@/libs/types/asset.type";

type ViewAssetModalProps = {
  assetId: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewAssetRecord({
  assetId,
  open,
  onClose,
  size = "lg",
}: ViewAssetModalProps) {
  const { data, isLoading, isError } = useAssetById(assetId);

  const asset = data?.data ?? data;

  console.log(assetId, asset);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded text-red-500">
          Failed to load asset
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded">No asset found</div>
      </div>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-auto overflow-y-auto",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-100 sticky top-0">
          <h2 className="text-lg font-semibold">Asset Details - <span className="italic text-red-500 text-sm font-md">{asset.name}</span></h2>

          <button onClick={onClose}>
            <X className="text-red-500 cursor-pointer" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4 text-sm">
          <Section label="Asset Name" value={asset.name} />
          <Section label="Asset Type" value={asset.type} />
          <Section label="Status" value={asset.status} />

          <Section
            label="Created At"
            value={
              asset.createdAt ? new Date(asset.createdAt).toDateString() : "-"
            }
          />

          <Section
            label="Updated At"
            value={
              asset.updatedAt ? new Date(asset.updatedAt).toDateString() : "-"
            }
          />

          {/* CUSTOM FIELDS */}
          <div>
            <p className="font-medium">Custom Fields</p>

            {asset.customFields &&
            Object.keys(asset.customFields).length > 0 ? (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(asset.customFields ?? {}).map(
                  ([key, value]) => (
                    <div key={key} className="border border-gray-100 p-1 rounded">
                      <p className="font-medium">{key}</p>
                      <p className="text-xs text-gray-500">{value}</p>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-gray-500">No custom fields</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Component */
function Section({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-600">
        {value !== undefined && value !== null ? String(value) : "-"}
      </p>
    </div>
  );
}
