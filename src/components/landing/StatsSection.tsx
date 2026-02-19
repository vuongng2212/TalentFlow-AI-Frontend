const stats = [
  { value: "10x", label: "Faster Screening" },
  { value: "89%", label: "AI Accuracy" },
  { value: "50%", label: "Cost Reduction" },
  { value: "2.5k+", label: "Companies" },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
