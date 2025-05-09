import {
  UsersIcon,
  PuzzlePieceIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";

const features = [
  {
    icon: <PuzzlePieceIcon className="size-6 text-white" />,
    title: "Multiple Format Support",
    description:
      "Save links, notes, and images—all in one place. CopperMind adapts to whatever you need to remember.",
  },
  {
    icon: <SquaresPlusIcon className="size-6 text-white" />,
    title: "Smart Tagging & Linking",
    description:
      "Categorize and connect your thoughts with powerful tagging and linking.",
  },
  {
    icon: <UsersIcon className="size-6 text-white" />,
    title: "Easy Sharing",
    description:
      "Make any memory public with one click. Share knowledge with friends, teammates, or the world.",
  },
];

export function Features() {
  return (
    <section className="pt-24 pb-6 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 border-t-4 border-b-4 border-t-primary-900 border-b-primary-500 font-medium">
      <h2 className="text-3xl md:text-4xl font-martel text-text-primary text-left ml-6 mb-12">
        Transform How You{" "}
        <span className="text-primary-200">Capture Ideas</span>:
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-12">
        {features.map((feature, idx) => (
          <article
            key={idx}
            className="flex flex-col items-center text-center bg-bg-dark/40 p-6 rounded-2xl shadow-md border-2 border-primary-500 transition-all hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary-400"
          >
            <div className="bg-secondary-900/70 p-4 rounded-full mb-4 ring-2 ring-transparent hover:ring-primary-500 transition">
              {feature.icon}
            </div>
            <h3 className="text-3xl font-cormorant font-medium text-primary-200 mb-2">
              {feature.title}
            </h3>
            <p className="text-text-on-dark font-martel">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
