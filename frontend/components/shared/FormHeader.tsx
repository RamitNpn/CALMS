import { X } from "lucide-react";
import Image from "next/image";

function FormHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-100 sticky top-0">
      <div className="flex items-center gap-3">
        <Image
          src="/DrivingLogo.png"
          alt="Public Driving Management System"
          width={48}
          height={48}
          priority
          className="object-contain h-auto w-auto"
        />

        <div className="hidden sm:flex flex-col leading-tight">
          <span className="font-bold text-blue-700 text-lg">PDMS</span>
          <span className="text-xs text-gray-600">
            Public Driving Management System
          </span>
        </div>
      </div>

      <button onClick={onClose}>
        <X className="text-red-500 border border-gray-200 cursor-pointer hover:bg-red-500 hover:text-white rounded" />
      </button>
    </div>
  );
}

export default FormHeader;
