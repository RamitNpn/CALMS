import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "../ui/button";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  page,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 my-4">
      {/* Previous Button */}
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Prev
      </Button>

      {/* Page Info */}
      <span className="text-sm font-medium text-gray-700">
        Page {page} of {totalPages}
      </span>

      {/* Next Button */}
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-2"
      >
        Next
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}