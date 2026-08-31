import "./HowItWorks.css";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineCheckBadge,
  HiOutlineSparkles,
} from "react-icons/hi2";

const steps = [
  {
    number: "01",
    title: "Report an Item",
    description:
      "Submit details about a lost or found item, including location, date, and photos.",
    icon: <HiOutlineClipboardDocumentList />,
  },
  {
    number: "02",
    title: "Security Review",
    description:
      "The Security Office reviews the report before it becomes visible on the platform.",
    icon: <HiOutlineShieldCheck />,
  },
  {
    number: "03",
    title: "Submit a Claim",
    description:
      "Students who recognize an item can submit an ownership claim for verification.",
    icon: <HiOutlineUserCircle />,
  },
  {
    number: "04",
    title: "Ownership Verified",
    description:
      "The Security Office verifies the claim using the submitted information.",
    icon: <HiOutlineCheckBadge />,
  },
  {
    number: "05",
    title: "Item Returned",
    description:
      "The verified owner collects the item, completing the recovery process.",
    icon: <HiOutlineSparkles />,
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <span className="badge-line"></span>
            HOW IT WORKS
            <span className="badge-line"></span>
          </span>

          <h2>
            Simple Process.
            <br />
            <span>Secure Recovery.</span>
          </h2>

          <p>
            From reporting an item to successfully recovering it, every step is
            designed to be simple, secure, and transparent.
          </p>
        </div>

        {/* Desktop Process Diagram */}
        <div className="process-diagram">
          {/* Curved connecting line */}
          <svg
            className="process-line"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="processGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" />
                <stop offset="50%" />
                <stop offset="100%" />
              </linearGradient>

              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Soft glow */}
            <path
              className="process-line-glow"
              d="
                M 0 205
                C 95 205, 120 205, 185 145
                C 245 90, 315 70, 390 125
                C 455 175, 505 260, 600 255
                C 695 250, 745 165, 810 120
                C 885 68, 955 95, 1015 150
                C 1080 205, 1120 205, 1200 205
              "
            />

            {/* Main line */}
            <path
              className="process-line-main"
              d="
                M 0 205
                C 95 205, 120 205, 185 145
                C 245 90, 315 70, 390 125
                C 455 175, 505 260, 600 255
                C 695 250, 745 165, 810 120
                C 885 68, 955 95, 1015 150
                C 1080 205, 1120 205, 1200 205
              "
            />
          </svg>

          {/* Steps */}
          <div className="process-steps">
            {steps.map((step, index) => (
              <div
                className={`process-step step-${index + 1}`}
                key={step.number}
              >
                {/* Large background number */}
                <span className="background-number">{step.number}</span>

                {/* Node */}
                <div className="process-node-wrapper">
                  <div className="node-dot"></div>

                  <div className="process-node">{step.icon}</div>
                </div>

                {/* Step content */}
                <div className="process-content">
                  <h3>{step.title}</h3>

                  <div className="title-line"></div>

                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="mobile-process">
          {steps.map((step) => (
            <div className="mobile-step" key={step.number}>
              <div className="mobile-node">{step.icon}</div>

              <div className="mobile-content">
                <span>{step.number}</span>

                <h3>{step.title}</h3>

                <div className="title-line"></div>

                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
