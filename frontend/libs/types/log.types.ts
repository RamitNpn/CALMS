export interface TLogEntry {
  _id: string;
  timestamp: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "VIEW" | "EDIT";
  userId: string;
  userName: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  module: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
