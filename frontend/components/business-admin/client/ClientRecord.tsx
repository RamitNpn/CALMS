"use client";

import { Trash2, Eye, Pencil, Plus } from "lucide-react";
import moment from "moment";
import TablePagination from "@/components/shared/Pagination";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { TClient } from "@/libs/types/client.types";
import { useDeleteClient } from "@/hooks/business-admin/client-management/removeClientData";
import { EditClientForm } from "./EditClientRecord";
import Button from "@/components/ui/button";
import { ClientForm } from "./ClientForm";

interface ClientTableProps {
  clients: TClient[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ClientRecord({
  clients,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: ClientTableProps) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: deleteClient } = useDeleteClient();
  const [itemToRemove, setItemToRemove] = useState<TClient | null>(null);
  const toast = useToast.getState();

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deleteClient(itemToRemove._id, {
      onSuccess: () => {
        toast.show({
          message: "Client deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },
    });
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full h-[71vh] overflow-y-scroll">
      <div className="flex justify-end mb-2">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Add Business Client
        </Button>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm leading-normal">
            <th className="py-2 px-2 text-left">SN</th>
            <th className="py-2 px-2 text-left">Client Name</th>
            <th className="py-2 px-2 text-left">Email</th>
            <th className="py-2 px-2 text-left">Phone</th>
            <th className="py-2 px-2 text-left">Gender</th>
            <th className="py-2 px-2 text-left">Role</th>
            <th className="py-2 px-2 text-left">Created At</th>
            <th className="py-2 px-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-[13px]">
          {clients.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-6 px-6 text-center text-gray-500">
                No Clients found
              </td>
            </tr>
          ) : (
            clients.map((client, index) => (
              <tr
                key={client._id}
                className="border-b border-gray-200 hover:bg-white transition rounded hover:translate-x-1"
              >
                <td className="py-2 px-2 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                <td className="py-2 px-2 text-left font-medium">
                  {client.userName}
                </td>

                <td className="py-2 px-2 text-left">{client.userEmail}</td>

                <td className="py-2 px-2 text-left">{client.userPhone}</td>

                <td className="py-2 px-2 text-left capitalize">
                  {client.gender || "-"}
                </td>

                <td className="py-2 px-2 text-left capitalize">
                  {client.role}
                </td>

                <td className="py-2 px-2 text-left">
                  {moment(client.createdAt).format("lll")}
                </td>

                <td className="py-2 px-2 text-left">
                  <div className="flex items-center gap-2">
                    {/* VIEW */}
                    <button
                      onClick={() =>
                        router.push(
                          `/pages/dashboard/business-admin/clients/${client._id}`,
                        )
                      }
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => setEditId(client._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setItemToRemove(client)}
                      className="p-2 border border-gray-200 rounded hover:bg-red-100 text-red-600 transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {editId && (
        <EditClientForm clientId={editId} onClose={() => setEditId(null)} />
      )}

      {open && <ClientForm onClose={() => setOpen(false)} />}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Client"
        message="Are you sure you want to remove this client?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
