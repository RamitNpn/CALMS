import Card from "@/components/ui/card";
import { CreditCard, DollarSign, TrendingUp } from "lucide-react";
import React from "react";

type BillingStatsProps = {
  totalRevenue: number;
  pendingPayments: number;
  overdueCount: number;
  averageInvoiceValue: number;
  invoiceCount: number;
};

function BillingStats({
  totalRevenue,
  pendingPayments,
  overdueCount,
  averageInvoiceValue,
  invoiceCount,
}: BillingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-foreground">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-2">Live revenue total</p>
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
              {overdueCount.toLocaleString()} overdue
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
              ${averageInvoiceValue.toFixed(0)}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              {invoiceCount.toLocaleString()} invoices
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
