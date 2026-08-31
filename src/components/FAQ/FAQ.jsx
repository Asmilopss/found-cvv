import { useState } from "react";
import "./FAQ.css";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is Found@CVV?",
      answer:
        "Found@CVV is a secure campus lost-and-found portal that helps CVV students report, search, and recover lost belongings using their university accounts.",
    },
    {
      question: "Who can use Found@CVV?",
      answer:
        "Found@CVV is designed for the CVV community. Students can access the portal using their university account to report items, browse listings, and manage their claims.",
    },
    {
      question: "How do I report a lost item?",
      answer:
        "Log in to your Found@CVV account, open the Report Lost section, provide the required details about your item, and submit the report.",
    },
    {
      question: "How do I report a found item?",
      answer:
        "If you find an item on campus, use the Report Found section to provide details such as the item name, category, location, date, and description.",
    },
    {
      question: "How do I claim a found item?",
      answer:
        "Open the details of the found item you believe belongs to you and submit a claim. Provide accurate information that can help the Security Office verify your ownership.",
    },
    {
      question: "How are claims verified?",
      answer:
        "Claims are reviewed by the Security Office. The information provided by the claimant is checked to determine whether the claim can be approved.",
    },
    {
      question: "What happens after I submit a claim?",
      answer:
        "Your claim will remain pending while it is being reviewed. You can check the current status of your claim from the My Claims section.",
    },
    {
      question: "Can I claim an item that has already been claimed?",
      answer:
        "No. Once an item has been successfully claimed, it is marked as claimed and is no longer available for new claims.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="faq-container">

        {/* Left Content */}
        <div className="faq-intro">
          <div className="faq-label">
            ✨ Frequently asked questions
          </div>

          <h2 className="faq-title">
            Frequently asked
            <span> questions</span>
          </h2>

          <p className="faq-description">
            Find answers to common questions about reporting lost items,
            submitting claims, and using the Found@CVV portal.
          </p>
        </div>

        {/* Right Accordion */}
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${
                openIndex === index ? "active" : ""
              }`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>

                <span className="faq-icon">
                  {openIndex === index ? "⌃" : "⌄"}
                </span>
              </button>

              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FAQ;