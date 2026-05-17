export interface TLog {
  _id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName: string;
  recordId?: string;
  recordName?: string;
  module: string;
  description: string;
  ipAddress?: string;
}
