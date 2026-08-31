import "./Features.css";
import FeatureCard from "./FeatureCard";
import {
  HiOutlineArchiveBox,
  HiOutlineBriefcase,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

const features = [
  {
    id: 1,
    icon: <HiOutlineArchiveBox />,
    title: "Report Lost Items",
    description:
      "Students can quickly submit details about belongings they have lost.",
  },
  {
    id: 2,
    icon: <HiOutlineBriefcase />,
    title: "Report Found Items",
    description: "Help others by reporting items you've found on campus.",
  },
  {
    id: 3,
    icon: <HiOutlineMagnifyingGlass />,
    title: "Smart Search & Filters",
    description: "Find matching items using powerful search and filters.",
  },
  {
    id: 4,
    icon: <HiOutlineShieldCheck />,
    title: "Verified Claim Process",
    description:
      "Claims are reviewed using campus CCTV and other available evidence.",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <span className="features-badge">✨ Features</span>

        <h2 className="features-title">
          Powerful Features to Make Finding Easier
        </h2>

        <p className="features-description">
          A complete campus solution with smart tools to report missing items,
          discover found belongings, and reconnect them with their owners.
        </p>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
