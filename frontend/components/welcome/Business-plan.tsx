"use client";

const businesses = [
  {
    id: "driving",
    name: "Driving Institute",
    features: ["Token System", "Fleet Mgmt", "Scheduling", "Exams"]
  },
  {
    id: "coaching",
    name: "Coaching Center",
    features: ["Students", "Attendance", "Exams", "Reports"]
  },
  {
    id: "clinic",
    name: "Clinic / Hospital",
    features: ["Token Queue", "Appointments", "Staff", "Reports"]
  },
  {
    id: "gym",
    name: "Gym / Fitness",
    features: ["Membership", "Attendance", "Billing"]
  },
  {
    id: "salon",
    name: "Salon / Spa",
    features: ["Booking", "Clients", "Billing"]
  },
  {
    id: "office",
    name: "Service Office",
    features: ["Token System", "Staff", "Reports"]
  }
];

export default function Step1Plan({ setStep, setData }: any) {
  return (
    <div className="grid grid-cols-3 gap-6 p-10">
      {businesses.map((biz) => (
        <div
          key={biz.id}
          className="border p-6 rounded-xl hover:border-blue-500 cursor-pointer"
          onClick={() => {
            setData((prev: any) => ({ ...prev, businessType: biz.id }));
            setStep(2);
          }}
        >
          <h2 className="text-xl font-bold">{biz.name}</h2>

          <ul className="mt-3 text-sm text-gray-500">
            {biz.features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>

          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Continue
          </button>
        </div>
      ))}
    </div>
  );
}