"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components";
import { Mail, Send, X, Users, Search, Trash2, Loader2 } from "lucide-react";
import { UserApi } from "@/libs/api/user.api";

type User = {
  _id: string;
  userName: string;
  userEmail: string;
};

type MailPayload = {
  emails: string[];
  subject: string;
  message: string;
};

type Errors = {
  subject?: string;
  message?: string;
  emails?: string;
};

export default function MailboxPage() {
  const toast = useToast.getState();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await UserApi.getAllUserApi({});
        setUsers(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.userName.toLowerCase().includes(search.toLowerCase()) ||
        u.userEmail.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const toggleEmail = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const selectAll = () =>
    setSelectedEmails(filteredUsers.map((u) => u.userEmail));

  const clearAll = () => setSelectedEmails([]);

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!message.trim()) {
      newErrors.message = "Message cannot be empty";
    }

    if (selectedEmails.length === 0) {
      newErrors.emails = "Select at least one recipient";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: MailPayload) => {
      const res = await fetch("/mail/send-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.show({
        message: "Email sent successfully",
        type: "success",
      });

      setSubject("");
      setMessage("");
      setSelectedEmails([]);
      setErrors({});
    },
    onError: () => {
      toast.show({
        message: "Failed to send email",
        type: "error",
      });
    },
  });
  const handleSend = () => {
    if (!validate()) return;

    mutate({
      emails: selectedEmails,
      subject,
      message,
    });
  };
  return (
    <div className="bg-gray-50 p-2 shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        <div className="lg:col-span-1 bg-white rounded shadow-sm flex flex-col overflow-hidden">
          {/* header */}
          <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <h2 className="font-semibold">Recipients</h2>
            </div>

            <p className="text-xs opacity-80 mt-1">
              {selectedEmails.length} selected
            </p>
          </div>

          {/* search */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                className="bg-transparent w-full text-sm outline-none"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs">
              <button onClick={selectAll} className="text-blue-600">
                Select all
              </button>
              <button
                onClick={clearAll}
                className="text-red-500 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>

          {/* users list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loadingUsers ? (
              <p className="text-sm text-gray-500 p-3">Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-sm text-gray-400 p-3">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleEmail(user.userEmail)}
                  className={`cursor-pointer p-2 rounded transition shadow-sm ${
                    selectedEmails.includes(user.userEmail)
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white"
                  }`}
                >
                  <p className="font-medium text-sm">{user.userName}</p>
                  <p className="text-xs text-gray-500">{user.userEmail}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded shadow-sm border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-500" />
              <h2 className="font-semibold">Compose Email</h2>
            </div>

            <span className="text-xs text-gray-500">
              {selectedEmails.length} recipients
            </span>
          </div>

          <div className="p-3 flex flex-wrap gap-2 border-b border-gray-100">
            {selectedEmails.length === 0 && (
              <p className="text-xs text-gray-400">No recipients selected</p>
            )}

            {selectedEmails.map((email) => (
              <span
                key={email}
                className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1"
              >
                {email}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() =>
                    setSelectedEmails((prev) => prev.filter((e) => e !== email))
                  }
                />
              </span>
            ))}
          </div>

          <div className="p-4 flex-1 flex flex-col gap-3 text-[13px]">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                className="w-full border border-gray-200 rounded p-2 text-sm outline-none"
                placeholder="Subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              {errors.subject && (
                <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full border border-gray-200 rounded p-2 h-60 text-sm outline-none resize-none overflow-y-scroll"
                placeholder="Write message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1">{errors.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSend}
                disabled={isPending}
                className="bg-gradient-to-r outline-none cursor-pointer from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Email
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
