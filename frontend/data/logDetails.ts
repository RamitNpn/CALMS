export interface LogEntry {
  id: string;
  timestamp: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "VIEW" | "EDIT";
  userId: string;
  userName: string;
  recordId?: string;
  recordName?: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  ipAddress?: string;
  userAgent?: string;
  module: string;
  description: string;
}
// Mock data for all modules
export const allMockLogs: LogEntry[] = [
  // Asset logs
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: "UPDATE",
    userId: "user-123",
    userName: "John Doe",
    recordId: "asset-1",
    recordName: "Laptop - Dell",
    module: "Assets",
    changes: [{ field: "status", oldValue: "active", newValue: "maintenance" }],
    description: "Updated asset status to maintenance",
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: "CREATE",
    userId: "user-456",
    userName: "Jane Smith",
    recordId: "asset-2",
    recordName: "Monitor - LG",
    module: "Assets",
    description: "Created new asset record",
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    action: "DELETE",
    userId: "user-789",
    userName: "Admin User",
    recordId: "asset-3",
    recordName: "Keyboard - Mechanical",
    module: "Assets",
    description: "Deleted asset record",
  },
  // Attendance logs
  {
    id: "log-att-1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: "UPDATE",
    userId: "user-123",
    userName: "John Doe",
    recordId: "att-1",
    recordName: "John Doe - 2024-05-15",
    module: "Attendance",
    changes: [{ field: "status", oldValue: "absent", newValue: "present" }],
    description: "Marked attendance as present",
  },
  {
    id: "log-att-2",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: "CREATE",
    userId: "user-456",
    userName: "Jane Smith",
    recordId: "att-2",
    recordName: "Jane Smith - 2024-05-15",
    module: "Attendance",
    description: "Attendance record created",
  },
  // Billing logs
  {
    id: "log-bill-1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: "UPDATE",
    userId: "user-123",
    userName: "John Doe",
    recordId: "bill-1",
    recordName: "Invoice #001",
    module: "Billing",
    changes: [{ field: "status", oldValue: "pending", newValue: "paid" }],
    description: "Updated billing status to paid",
  },
  {
    id: "log-bill-2",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: "CREATE",
    userId: "user-456",
    userName: "Jane Smith",
    recordId: "bill-2",
    recordName: "Invoice #002",
    module: "Billing",
    description: "Created new billing record",
  },
  // Client logs
  {
    id: "log-client-1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: "UPDATE",
    userId: "user-123",
    userName: "John Doe",
    recordId: "client-1",
    recordName: "ABC Corporation",
    module: "Clients",
    changes: [{ field: "status", oldValue: "active", newValue: "inactive" }],
    description: "Updated client status",
  },
  {
    id: "log-client-2",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: "CREATE",
    userId: "user-456",
    userName: "Jane Smith",
    recordId: "client-2",
    recordName: "XYZ Industries",
    module: "Clients",
    description: "Created new client record",
  },
  // Staff logs
  {
    id: "log-staff-1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: "UPDATE",
    userId: "user-123",
    userName: "John Doe",
    recordId: "staff-1",
    recordName: "John Doe",
    module: "Staff",
    changes: [
      {
        field: "position",
        oldValue: "Developer",
        newValue: "Senior Developer",
      },
    ],
    description: "Updated staff position",
  },
  {
    id: "log-staff-2",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: "CREATE",
    userId: "user-456",
    userName: "Jane Smith",
    recordId: "staff-2",
    recordName: "Alice Johnson",
    module: "Staff",
    description: "Created new staff record",
  },
  // System logs
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    action: "LOGIN",
    userId: "user-123",
    userName: "John Doe",
    module: "System",
    ipAddress: "192.168.1.100",
    description: "User logged in",
  },
  {
    id: "log-5",
    timestamp: new Date(Date.now() - 86400000 - 28800000).toISOString(),
    action: "LOGOUT",
    userId: "user-123",
    userName: "John Doe",
    module: "System",
    description: "User logged out",
  },
];
