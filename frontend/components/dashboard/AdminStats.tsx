import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function AdminStatsPage() {
  const stats = [
    {
      name: "Businesses",
      value: 120,
      icon: Building2,
      bg: "bg-gray-200",
    },
    {
      name: "Clients",
      value: 840,
      icon: Users,
      bg: "bg-gray-200",
    },
    {
      name: "Staffs",
      value: 230,
      icon: Users,
      bg: "bg-gray-200",
    },
    {
      name: "Payments",
      value: 560,
      icon: CreditCard,
      bg: "bg-gray-200",
    },
  ];

  const activeUsers = 1020;
  const totalUsers = 1200;
  const businessUsersRatio = ((840 / totalUsers) * 100).toFixed(1);
  const revenue = 18500;

  return (
    <div className="space-y-4 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of system performance and business activity
        </p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap bg-gray-150 p-2 justify-between gap-2 mb-4">
        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className={`${item.bg} text-gray-900 w-full sm:w-1/2 md:w-1/4 rounded p-2`}
            >
              <p className="text-xs sm:text-sm md:text-[14px]">{item.name}</p>

              <h1 className="text-sm sm:text-md md:text-[18px] font-semibold px-2 sm:px-4 flex items-center gap-2">
                <Icon size={16} />
                {item.value} in total
              </h1>

              <div className="flex gap-1 text-[10px] sm:text-[12px] md:text-[13px] items-center px-1 sm:px-2">
                <i className="fa-solid fa-arrow-up text-green-700"></i>
                <i className="fa-solid fa-arrow-down text-red-700"></i>
                <span>Since last time</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap md:flex-nowrap bg-gray-100 p-2 justify-between gap-2 mb-4">
        <div className="bg-red-500 text-gray-100 w-full sm:w-1/2 md:w-1/3 rounded p-2">
          <p className="text-xs sm:text-sm md:text-[14px]">Active Users</p>

          <h1 className="text-sm sm:text-md md:text-[18px] font-semibold px-2 sm:px-4 flex items-center gap-2">
            <Activity size={16} />
            {activeUsers} users active
          </h1>

          <div className="flex gap-1 text-[10px] sm:text-[12px] md:text-[13px] items-center px-1 sm:px-2">
            <i className="fa-solid fa-arrow-up text-green-700"></i>
            <i className="fa-solid fa-arrow-down text-red-700"></i>
            <span>Since last time</span>
          </div>
        </div>

        <div className="bg-green-500 text-gray-100 w-full sm:w-1/2 md:w-1/3 rounded p-2">
          <p className="text-xs sm:text-sm md:text-[14px]">Business Ratio</p>

          <h1 className="text-sm sm:text-md md:text-[18px] font-semibold px-2 sm:px-4 flex items-center gap-2">
            <TrendingUp size={16} />
            {businessUsersRatio}
          </h1>

          <div className="flex gap-1 text-[10px] sm:text-[12px] md:text-[13px] items-center px-1 sm:px-2">
            <i className="fa-solid fa-arrow-up text-green-700"></i>
            <i className="fa-solid fa-arrow-down text-red-700"></i>
            <span>Clients vs users</span>
          </div>
        </div>

        <div className="bg-blue-500 text-gray-100 w-full sm:w-1/2 md:w-1/3 rounded p-2">
          <p className="text-xs sm:text-sm md:text-[14px]">Total Revenue</p>

          <h1 className="text-sm sm:text-md md:text-[18px] font-semibold px-2 sm:px-4 flex items-center gap-2">
            <CreditCard size={16} />
            ${revenue} in total
          </h1>

          <div className="flex gap-1 text-[10px] sm:text-[12px] md:text-[13px] items-center px-1 sm:px-2">
            <i className="fa-solid fa-arrow-up text-green-700"></i>
            <i className="fa-solid fa-arrow-down text-red-700"></i>
            <span>Monthly income</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 border rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Performance Insights
        </h3>

        <p className="text-sm text-gray-500">
          Charts will be added here (Recharts / Chart.js) for revenue trends,
          user growth, and business analytics.
        </p>
      </div>
    </div>
  );
}
