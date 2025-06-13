export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Create A Memory",
      description:
        "Save anything that matters—whether it's a link, image, or a quick note.",
    },
    {
      number: 2,
      title: "Add Tags And Descriptions",
      description:
        "Organize your memories with custom tags and notes for easy search later.",
    },
    {
      number: 3,
      title: "View and Filter by Type",
      description:
        "Access memories by format—links, notes, or images—in a clean layout.",
    },
    {
      number: 4,
      title: "Share When You Want To",
      description:
        "Toggle sharing to generate a public page you can send to anyone.",
    },
  ];

  return (
    <div className="py-24 lg:px-38 bg-gradient-to-b from-bg-dark to-secondary-950">
      <h2 className="text-3xl font-martel text-text-on-dark mx-4 mb-10 text-center md:text-left">
        How It Works:
      </h2>
      <div className="mx-4 grid grid-cols-12 gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col col-span-12 md:col-span-6 lg:col-span-3 items-center p-6 rounded-xl border-2 border-primary-400 bg-gradient-to-br from-accent-700/20 
            via-accent-500/20 to-accent-400/20 shadow-sm hover:-translate-y-1 transition"
          >
            <div className="px-5 py-2 text-3xl rounded-full bg-accent-900 border-primary-400 border text-primary-400 font-serif font-bold mb-4">
              {step.number}
            </div>
            <h3 className="text-2xl font-cormorant font-semibold text-text-on-dark mb-3 text-center">
              {step.title}
            </h3>
            <p className="text-center text-accent-100 font-martel">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
