import { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChevronRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState("/dashboardDesign/uploadPic.svg");
  const [selectedSection, setSelectedSection] = useState("profile");

  useEffect(() => {
    if (!user && role !== "admin") {
      navigate("/login");
    }
  }, [user, role, navigate]);

  const handleLogout = () => {
    logout(navigate);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const formatDateWithSuffix = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();

    // Determine the suffix
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${suffix} ${month} ${year}`;
  };

  const iconMap = {
    Male: "/dashboardDesign/male.svg",
    Female: "/dashboardDesign/female.svg",
    Boy: "/dashboardDesign/male.svg", // maps Boy → Male icon
    Girl: "/dashboardDesign/female.svg", // maps Girl → Female icon
    Sporty: "/dashboardDesign/sporty.svg",
    Casual: "/dashboardDesign/casual.svg",
    Formal: "/dashboardDesign/formal.svg",
    Minimalist: "/dashboardDesign/minimalist.svg",
    Creative: "/dashboardDesign/creative.svg",
    Curious: "/dashboardDesign/curious.svg",
    Logical: "/dashboardDesign/logical.svg",
    Playful: "/dashboardDesign/playful.svg",
    SmartThinker: "/dashboardDesign/smartThinker.svg",
    MysterySolver: "/dashboardDesign/mysterySolver.svg",
    Talkative: "/dashboardDesign/talkative.svg",
    Fantasy: "/dashboardDesign/fantasy.svg",
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-lg flex flex-col py-8 px-4">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-10">
            <img
              src="/dashboardDesign/homeImg.svg"
              alt="Logo"
              className="w-15 h-15"
            />
            <h1 className="text-2xl font-bold text-green-600 -mt-1">
              Edumaniax
            </h1>
          </Link>

          <nav className="flex flex-col gap-7 ml-5 text-sm font-medium">
            {/* My Profile Button */}
            <button
              className={`flex items-center gap-3 hover:text-green-700 ${
                selectedSection === "profile"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
              onClick={() => setSelectedSection("profile")}
            >
              <img
                src="/dashboardDesign/profile.svg"
                alt="Profile"
                className="w-5 h-5"
                style={{
                  filter:
                    selectedSection === "profile"
                      ? "grayscale(0%)"
                      : "grayscale(100%)",
                }}
              />
              <span className="font-bold">My Profile</span>
            </button>

            {/* My Modules Button */}
            <button
              className={`flex items-center gap-3 hover:text-green-700 ${
                selectedSection === "modules"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
              onClick={() => setSelectedSection("modules")}
            >
              <img
                src={
                  selectedSection === "modules"
                    ? "/dashboardDesign/moduleGreen.svg"
                    : "/dashboardDesign/modules.svg"
                }
                alt="Modules"
                className="w-5 h-5"
              />
              <span className="font-bold">My Modules</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-500 hover:text-red-600"
            >
              <img
                src="/dashboardDesign/logout.svg"
                alt="Logout"
                className="w-5 h-5"
              />
              Log Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 overflow-x-hidden">
        {/* Conditional Rendering for Modules Section */}
        {selectedSection === "modules" && (
          <div className="flex flex-col items-center w-full px-4 py-6">
            {/* Top Heading Box */}
            <div className="bg-white w-full max-w-6xl rounded-lg shadow-sm px-6 py-4 mb-6">
              <h2 className="text-3xl font-bold text-gray-900">My Modules</h2>
            </div>

            {/* Empty State Box */}
            <div className="bg-white w-full max-w-6xl rounded-lg shadow-md flex flex-col items-center justify-center p-10">
              <img
                src="/blogDesign/notfound.svg"
                alt="No Modules"
                className="w-64 h-auto mb-6"
              />
              <h3 className="text-xl font-bold text-gray-800 -mt-18">
                No Modules Available
              </h3>
              <p className="text-gray-600 mb-4 text-sm mt-2">
                Upgrade your plan to learn via modules
              </p>
              <Link
                to="/pricing"
                className="bg-[#068F36] hover:bg-green-700 text-white px-5 py-2 rounded-lg inline-block text-center"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {selectedSection === "profile" && (
          <div className="max-w-6xl mx-auto px-6 pt-6">
            {/* DASHBOARD HEADER */}
            <div className="bg-[#068F36] text-5xl font-bold text-center px-10 py-4 rounded-md shadow-sm mb-8">
              <span className="text-white" style={{ opacity: 0.72 }}>
                DASHBOARD
              </span>
            </div>

            {/* PROFILE + CHARACTER */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 mb-10">
              {/* LEFT COLUMN (Profile + Comments) */}
              <div className="flex flex-col gap-6 max-w-[480px]">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-md p-6 relative">
                  {/* Avatar */}
                  <div className="flex flex-col items-center relative -mt-12">
                    <img
                      src={avatar}
                      alt="Profile Avatar"
                      className="w-24 h-24 rounded-full"
                    />

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {/* Upload Button */}
                    <button
                      onClick={handleUploadClick}
                      className="absolute mt-17 ml-30 transform translate-y-1/2 bg-[#068F36] text-white text-xs px-4 py-1 rounded shadow hover:bg-green-700"
                    >
                      Upload Photo
                    </button>
                  </div>

                  {/* Profile Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                    {/* Left Section: Name, Class, Age */}
                    <div className="border rounded-lg p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-500 text-xs">Your Name</p>
                          <p className="font-semibold">{user.name}</p>
                        </div>
                        <button className="bg-[#F0EFFA] text-gray-600 text-xs px-3 py-1 rounded-lg">
                          Edit
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-500 text-xs">Class</p>
                          <p className="font-semibold">{user.userClass}</p>
                        </div>
                        <button className="bg-[#F0EFFA] text-gray-600 text-xs px-3 py-1 rounded-lg">
                          Edit
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-500 text-xs">Age</p>
                          <p className="font-semibold">{user.age} Yrs.</p>
                        </div>
                        <button className="bg-[#F0EFFA] text-gray-600 text-xs px-3 py-1 rounded-lg">
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Right Section: Phone, Email, Account Created On */}
                    <div className="border rounded-lg p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-500 text-xs">Phone Number</p>
                          <p className="font-semibold">{user.phonenumber}</p>
                        </div>
                        <button className="bg-[#F0EFFA] text-gray-600 text-xs px-3 py-1 rounded-lg">
                          Edit
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-500 text-xs">Email ID</p>
                        </div>
                        <button className="bg-[#068F36] text-white text-xs px-3 py-1 rounded-lg">
                          Add Now
                        </button>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs">
                          Account Created On
                        </p>
                        <p className="font-semibold">
                          {formatDateWithSuffix(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-xl shadow-md p-5">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">
                    Comments Written
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm flex-1">
                      <h5 className="text-sm font-semibold mb-1 text-blue-800">
                        AI Research Blog
                      </h5>
                      <p className="text-sm text-gray-600">
                        Excellent conversation with him.. very knowledgeable
                        person happy to talk with him
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm flex-1">
                      <h5 className="text-sm font-semibold mb-1 text-blue-800">
                        Data Analytics and Research 2025
                      </h5>
                      <p className="text-sm text-gray-600">
                        Excellent conversation with him.. very knowledgeable
                        person happy to talk with him
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (Character Card) */}
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start w-full min-h-[430px]">
                {/* Header */}
                <div className="w-full -ml-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 text-left ml-4">
                    Your Character
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-4 text-left ml-4">
                    {user.characterName}
                  </p>
                </div>

                {/* Character Traits + Info */}
                <div className="w-full flex flex-col lg:flex-row gap-6">
                  {/* Left Grid (Traits & Info) */}
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    {/* Gender */}
                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-white shadow-sm">
                      <img
                        src={iconMap[user.characterGender]}
                        alt={user.characterGender}
                        className="w-[2.2rem] h-[1.8rem] flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="font-semibold">{user.characterGender}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-white shadow-sm">
                      <img
                        src={iconMap[user.characterStyle]}
                        alt={user.characterStyle}
                        className="w-[3.5rem] h-[3rem] flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs text-gray-500">Style</p>
                        <p className="font-semibold">{user.characterStyle}</p>
                      </div>
                    </div>

                    {/* Traits */}
                    {user.characterTraits.map((trait, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 border rounded-lg p-3 bg-white shadow-sm"
                      >
                        <img
                          src={iconMap[trait]}
                          alt={trait}
                          className="w-[3rem] h-[2.5rem] flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs text-gray-500">
                            Trait {index + 1}
                          </p>
                          <p className="font-semibold">{trait}</p>
                        </div>
                      </div>
                    ))}

                    {/* Fact Section */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-6 text-left col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Fact</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Meet <strong>“{user.characterName}”</strong> who is{" "}
                        {user.characterTraits.map((trait, index) => {
                          const percentages = [40, 30, 20, 10];
                          const isLast =
                            index === user.characterTraits.length - 1;
                          return (
                            <span key={trait}>
                              {percentages[index]}% {trait.toLowerCase()}
                              {!isLast ? ", " : ""}
                            </span>
                          );
                        })}
                      </p>
                    </div>

                    {/* Button */}
                    <Link
                      to="/courses"
                      className="bg-[#068F36] col-span-2 mt-4 text-white px-5 font-semibold py-2 rounded-lg hover:bg-green-700 flex justify-center items-center gap-2 w-full text-center"
                    >
                      Start Exploration Now
                      <ChevronRight className="mt-1" size={18} />
                    </Link>
                  </div>

                  {/* Right: Character Image */}
                  <div className="w-full h-[250px] lg:w-44 flex items-center justify-center mt-6 lg:mt-0">
                    <img
                      src="/dashboardDesign/boy.svg"
                      alt="Character"
                      className="object-contain w-full h-72"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
