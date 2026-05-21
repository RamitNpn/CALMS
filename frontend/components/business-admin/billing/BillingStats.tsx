import Card from "@/components/ui/card";
import { CreditCard, DollarSign, TrendingUp } from "lucide-react";
import React from "react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue";
}

interface BillingStats {
  week: number;
  month: number;
  year: number;
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    clientName: "Acme Corporation",
    amount: 5000,
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    clientName: "Tech Innovations Inc",
    amount: 3500,
    date: "2024-01-20",
    dueDate: "2024-02-20",
    status: "sent",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    clientName: "Global Solutions Ltd",
    amount: 7200,
    date: "2024-01-25",
    dueDate: "2024-02-25",
    status: "overdue",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    clientName: "Digital Ventures",
    amount: 4800,
    date: "2024-02-01",
    dueDate: "2024-03-01",
    status: "draft",
  },
];

function BillingStats() {
  const totalRevenue = mockInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingPayments = mockInvoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-foreground">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-2">
              Pending Payments
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${pendingPayments.toLocaleString()}
            </p>
            <p className="text-xs text-orange-600 mt-2">
              {mockInvoices.filter((inv) => inv.status === "overdue").length}{" "}
              overdue
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-2">
              Avg Invoice Value
            </p>
            <p className="text-3xl font-bold text-foreground">
              $
              {(
                mockInvoices.reduce((sum, inv) => sum + inv.amount, 0) /
                mockInvoices.length
              ).toFixed(0)}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              {mockInvoices.length} invoices
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default BillingStats;
