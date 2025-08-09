import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import Hero from "@/PricingDesign/Hero";
import emailjs from "@emailjs/browser";

// Trial Booking Modal Component - Copied from Home.jsx
const TrialBookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    schoolName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        class: "",
      });
      setShowSuccess(false);
      setError("");
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // EmailJS configuration - Same as Home.jsx
      const serviceId = "service_52co609";
      const templateId = "template_h7uvb49";
      const publicKey = "zgnJuM3MRywVUxjcR";

      const templateParams = {
        to_email: "anujyelve3074@gmail.com",
        subject: "New Institutional Plan Inquiry - Contact Us",
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        schoolName: formData.schoolName,
        message: `A new user wants to contact us:
        Name: ${formData.fullName}
        Email: ${formData.email}
        Phone Number: ${formData.phoneNumber}
        Organization/Institution: ${formData.schoolName}
        Plan: Institutional Plan`,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setShowSuccess(true);

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* Modal content */}
          <div className="p-6 sm:p-8">
            {!showSuccess ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Contact US
                </h2>
                <p className="text-gray-600 mb-6">
                  Fill out the form below and we'll contact you soon for your
                  Institutional Plan!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Organization/Class */}
                  <div>
                    <label
                      htmlFor="class"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Organization/Institution *
                    </label>
                    <input
                      type="text"
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your organization/institution name"
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? "Sending Request..." : "Contact Us"}
                  </button>
                </form>
              </>
            ) : (
              /* Success message */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Request Sent Successfully!
                </h3>
                <p className="text-gray-600">
                  Thank you! We'll contact you soon to discuss your
                  Institutional Plan needs.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const plans = [
  {
    title: "STARTER PLAN",
    price: "₹0",
    frequency: "Per member, per Month",
    description: "Perfect to explore and get started.",
    features: [
      "Access to 1 free game/module",
      "Notes for the selected module",
      "Access to basic learning tools",
      "No completion certificates",
      { text: "No access to premium modules", excluded: true },
      { text: "No AI powered personalized assessment", excluded: true },
    ],
    button: "Start Now",
  },
  {
    title: "SOLO PLAN",
    price: "₹199",
    frequency: "Per member, per Month",
    description: "Ideal for focused learning on a specific topic.",
    features: [
      "Access to 1 premium module of choice",
      "Notes for the selected module",
      "Interactive activities and assessments",
      { text: "No access to all premium modules", excluded: true },
      { text: "No AI powered personalized assessment", excluded: true },
      { text: "No completion certificates", excluded: true },
    ],
    button: "Start Now",
  },
  {
    title: "PRO PLAN",
    price: "₹1433",
    frequency: "Per member, per 3 Month",
    description: "Full learning experience for committed users",
    features: [
      "Access to all premium modules",
      "Notes for every module",
      "All interactive games and assessments",
      "AI powered personalized assessment",
      "Completion certificates",
    ],
    button: "Start Now",
    tag: "Popular",
    discount: "Save 20%",
  },
  {
    title: "INSTITUTIONAL PLAN",
    price: "Custom",
    frequency: "",
    description: "Tailored for bulk use with flexibility.",
    features: [
      "Access for 30+ users",
      "All modules notes & games included",
      "Custom onboarding & priority support",
      "Live Lectures by SME",
      "AI powered personalized assessment",
      "Completion certificates",
    ],
    button: "Contact Us",
  },
];

const faqData = [
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! All users get a 7-day free trial with access to all premium features. No card required.",
    QbgColor: "bg-[#6DEE0E]", // Vivid green
    AbgColor: "bg-[#E9FCD4]", // 🍏 Light green pastel
  },
  {
    question: "What payment type do you accept?",
    answer:
      "We accept all major credit and debit cards, PayPal, UPI, crypto wallets, etc.",
    QbgColor: "bg-[#FEC6C7]", // Soft pink
    AbgColor: "bg-[#FFF1F2]", // 🌸 Ultra-light pink
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely! You can cancel anytime from your dashboard with just a click. No hidden conditions.",
    QbgColor: "bg-[#DBEDFB]", // Light blue
    AbgColor: "bg-[#F0F9FF]", // ❄ Icy sky blue
  },
  {
    question: "Do I get customer support?",
    answer:
      "Of course! Our team is available 24/7 via live chat and email to help you anytime.",
    QbgColor: "bg-[#DABFFF]", // Lavender
    AbgColor: "bg-[#F5EBFF]", // 🪻 Soft lavender haze
  },
  {
    question: "What if I’m not satisfied with EduManiax after joining?",
    answer:
      "Don’t worry at all. EduManiax offers a refund as per the package bought, which you can get in your bank once your request is processed. Before enrolling, you will also get a full demo of the platform, personalized one-on-one interaction, and access to our support team to help you at every step.",
    QbgColor: "bg-[#FFD966]", // Warm yellow
    AbgColor: "bg-[#FFF8E5]", // 🍯 Soft cream yellow
  },
  {
    question: "What is Edumaniax?",
    answer:
      "Edumaniax is a gamified learning platform for students in Classes 6 to 12 across India. It teaches essential 21st-century skills like AI, finance, law, communication, and entrepreneurship through interactive, story-based modules designed to make learning fun and practical.",
    QbgColor: "bg-[#A7F3D0]", // Mint green
    AbgColor: "bg-[#ECFDF5]", // 🌿 Light mint background
  },
  {
    question: "Who is Edumaniax for?",
    answer:
      "Our programs are designed for school students (Classes 6–12), parents seeking skill-based education, and schools in cities like Delhi, Lucknow, Bengaluru, and Jaipur that want to integrate NEP 2020-aligned content into their curriculum.",
    QbgColor: "bg-[#FBCFE8]", // Pink blush
    AbgColor: "bg-[#FFF0F9]", // 🌸 Light pastel pink
  },
  {
    question: "What will students learn?",
    answer:
      "Students gain hands-on skills in AI tools, prompt engineering, legal awareness, investing, entrepreneurship, and public speaking. Each course delivers clear learning outcomes that build creativity, confidence, and future career readiness.",
    QbgColor: "bg-[#FDE68A]", // Soft gold
    AbgColor: "bg-[#FFFBEB]", // 🌼 Light golden cream
  },
  {
    question: "How does Edumaniax assess student progress?",
    answer:
      "We use AI-driven assessments that adapt to each learner’s pace, offer real-time feedback, and generate detailed performance reports for parents and schools. The focus is on applied learning, not just marks.",
    QbgColor: "bg-[#BAE6FD]", // Sky blue
    AbgColor: "bg-[#E0F7FF]", // ☁ Light cloud blue
  },
  {
    question: "How is it different from regular edtech apps?",
    answer:
      "Unlike video-based apps, Edumaniax turns learning into games and quests. Students complete challenges, earn rewards, and build real-world skills through simulations—making learning immersive and unforgettable.",
    QbgColor: "bg-[#C7D2FE]", // Soft lavender blue
    AbgColor: "bg-[#EEF2FF]", // 🌌 Misty lavender
  },
  {
    question: "Is Edumaniax aligned with the school curriculum?",
    answer:
      "Yes, our modules are mapped to NEP 2020 guidelines and complement school subjects like civics, coding, and economics, ensuring students stay ahead without adding academic pressure.",
    QbgColor: "bg-[#FCA5A5]", // Coral pink
    AbgColor: "bg-[#FFE5E5]", // 🌺 Soft coral cream
  },
  {
    question: "Do students receive certificates?",
    answer:
      "Yes, learners receive digital certificates after completing modules, which are valuable for portfolios, internships, and college applications.",
    QbgColor: "bg-[#FCD34D]", // Bright yellow
    AbgColor: "bg-[#FFF9E6]", // 🍋 Lemon cream
  },
  {
    question: "Can schools partner with Edumaniax?",
    answer:
      "Absolutely. Schools and institutes can integrate our programs during school hours or as weekend clubs. We offer dashboards, training, and ongoing support for seamless implementation.",
    QbgColor: "bg-[#86EFAC]", // Light green
    AbgColor: "bg-[#ECFDF5]", // 🌱 Soft pastel green
  },
];

const Pricing = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false); // Added for modal state

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="relative">
      {/* Trial Booking Modal */}
      <TrialBookingModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
      />

      {/* Hero Section */}
      <div className="relative z-0">
        <Hero />
      </div>

      {/* Pricing Cards */}
      <section className="relative z-10 bg-transparent -mt-40 px-4 pt-16 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 hover:border-[#068F36] transition-all duration-300 flex flex-col justify-between relative"
            >
              {/* Tags */}
              <div className="relative mb-4">
                {plan.title === "PRO PLAN" && (
                  <img
                    src="/pricingDesign/save20.svg"
                    alt="Save 20%"
                    className="absolute -mt-9 -mr-7 -top-0 right-0.5 w-[113px] h-[49px] z-10"
                  />
                )}
                {plan.tag && (
                  <span className="bg-[#EFB100] text-black text-xs font-bold px-2 py-1 rounded w-fit shadow">
                    {plan.tag}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div className="flex justify-start">
                <h3
                  className="text-xs font-bold uppercase text-[#007127] px-3 py-1 rounded"
                  style={{ backgroundColor: "rgba(165, 237, 110, 0.31)" }}
                >
                  {plan.title}
                </h3>
              </div>
              <p className="text-sm text-black mt-2">{plan.description}</p>
              <hr className="my-3 border-gray-300" />
              <p className="text-4xl font-extrabold text-[#042038] mt-1">
                {plan.price}
              </p>
              <p className="text-xs text-black font-semibold mt-1">
                {plan.frequency}
              </p>
              <hr className="my-3 border-gray-300 mt-5" />

              {/* Features */}
              <ul className="text-sm space-y-2 flex-1 mt-2">
                {plan.features.map((feat, i) => {
                  const text = typeof feat === "string" ? feat : feat.text;
                  const excluded =
                    typeof feat === "object" && feat.excluded === true;

                  return (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 flex-shrink-0 mt-1">
                        <img
                          src={
                            excluded
                              ? "/pricingDesign/cross.svg"
                              : "/pricingDesign/tick.svg"
                          }
                          alt={excluded ? "Not included" : "Included"}
                          className="w-full h-full object-contain"
                        />
                      </span>
                      <span className={excluded ? "text-red-600" : ""}>
                        {text}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Button - Modified to handle Contact Us differently */}
              {plan.button === "Contact Us" ? (
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="bg-[#068F36] text-white font-semibold py-2 px-4 rounded-md hover:brightness-110 transition mt-4 inline-block text-center w-full"
                >
                  {plan.button}
                </button>
              ) : (
                <Link
                  to="/payment-required"
                  className="bg-[#068F36] text-white font-semibold py-2 px-4 rounded-md hover:brightness-110 transition mt-4 inline-block text-center"
                >
                  {plan.button}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center mt-16">
          <h4 className="text-2xl lg:text-3xl text-black mb-2">
            Payment Methods
          </h4>
          <div className="flex justify-center items-center gap-4 mb-1">
            <img
              src="/pricingDesign/cards.svg"
              alt="Payment Methods"
              className="h-6 object-contain"
            />
          </div>
          <p className="text-2xs mt-2 text-gray-400">
            We accept Credit Cards, Debit Cards, Paypal, Crypto, etc.
          </p>
        </div>

        {/* FAQ Section */}
        <section className="py-1 sm:py-2 mt-62">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-black mb-2 sm:mb-4">
              Frequently Asked
            </h2>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-black mb-2 sm:mb-4">
              Questions
            </h2>
            <p className="text-black text-sm sm:text-lg mb-8 sm:mb-16">
              Everything you need to know before getting started
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  onClick={() => toggleFAQ(index)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="cursor-pointer transition-all duration-300 overflow-hidden rounded-2xl"
                >
                  {/* Wrapper for Question + Answer */}
                  <div className="rounded-2xl overflow-hidden">
                    {/* Question Section */}
                    <div
                      className={`flex ${faq.QbgColor} p-6 justify-between items-center`}
                    >
                      <h3 className="text-sm sm:text-lg font-semibold text-black text-left flex-1 pr-2">
                        {faq.question}
                      </h3>
                      <div className="w-6 sm:w-8 h-6 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <ChevronDown
                          className={`w-3 sm:w-4 h-3 sm:h-4 text-green-600 transition-transform duration-300 ${
                            openFAQ === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Answer Section */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={
                        openFAQ === index
                          ? { height: "auto", opacity: 1 }
                          : { height: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className={`overflow-hidden ${faq.AbgColor}`}
                    >
                      <div className="p-4 pt-6 text-sm text-black">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Pricing;
