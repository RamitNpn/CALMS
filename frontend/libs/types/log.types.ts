export interface TLogEntry {
  _id: string;
  timestamp: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "VIEW" | "EDIT";
  userId: string;
  title: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  module: string;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
