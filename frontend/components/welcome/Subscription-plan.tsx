"use client";

const plans = [
  { id: "starter", price: "1999", features: ["3 Modules", "200 Clients"] },
  { id: "growth", price: "4999", features: ["All Modules", "Unlimited"] },
  { id: "enterprise", price: "12999", features: ["Everything", "White-label"] }
];

export default function Step2Plan({ setStep, setData }: any) {
  return (
    <div className="grid grid-cols-3 gap-6 p-10">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="border p-6 rounded-xl cursor-pointer hover:border-green-500"
          onClick={() => {
            setData((prev: any) => ({ ...prev, plan: plan.id }));
            setStep(3);
          }}
        >
          <h2 className="text-xl font-bold">{plan.id}</h2>
          <p className="text-lg">NPR {plan.price}</p>

          <ul className="text-sm mt-2">
            {plan.features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}