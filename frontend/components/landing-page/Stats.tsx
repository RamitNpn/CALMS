const benefits = [
  { metric: "70%", text: "faster staff management" },
  { metric: "95%", text: "attendance accuracy" },
  { metric: "50%", text: "reduction in admin time" },
  { metric: "100%", text: "data security" },
];

function Stats() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {benefit.metric}
              </p>
              <p className="text-sm md:text-base text-muted-foreground">
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
