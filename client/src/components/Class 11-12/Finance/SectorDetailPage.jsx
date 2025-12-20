import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Chart from "react-apexcharts";

const SectorDetailPage = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);

  // Initial stocks data (same as in Game2.jsx)
  const initialStocks = {
    TECHZ: {
      name: "TechZon",
      sector: "Technology",
      price: 250,
      history: [240, 245, 250, 248, 252, 255, 250, 260, 258, 250],
      color: "from-blue-500 to-cyan-400",
      icon: "💻",
    },
    MEDIC: {
      name: "MediCore",
      sector: "Pharma",
      price: 180,
      history: [175, 178, 180, 185, 182, 188, 180, 175, 185, 180],
      color: "from-green-500 to-emerald-300",
      icon: "💊",
    },
    DRIVE: {
      name: "DriveUp",
      sector: "Auto",
      price: 120,
      history: [115, 118, 120, 125, 122, 128, 120, 115, 125, 120],
      color: "from-red-300 to-pink-400",
      icon: "🚗",
    },
    BANKR: {
      name: "BankRise",
      sector: "Finance",
      price: 300,
      history: [295, 298, 300, 305, 302, 308, 300, 295, 305, 300],
      color: "from-yellow-500 to-orange-500",
      icon: "🏦",
    },
    ECON: {
      name: "EcoNest",
      sector: "Green Energy",
      price: 85,
      history: [80, 82, 85, 88, 86, 90, 85, 80, 88, 85],
      color: "from-purple-500 to-indigo-400",
      icon: "🌱",
    },
  };

  useEffect(() => {
    // Get stock data from localStorage (set by Game2 when navigating)
    const stockData = localStorage.getItem(`stock_${ticker}`);
    if (stockData) {
      try {
        const parsed = JSON.parse(stockData);
        setStock({ ...parsed, ticker });
        // Clean up after reading
        localStorage.removeItem(`stock_${ticker}`);
      } catch (e) {
        console.error("Error parsing stock data:", e);
      }
    } else if (initialStocks[ticker]) {
      // Fallback to initial stocks if no localStorage data
      setStock({ ...initialStocks[ticker], ticker });
    }
  }, [ticker]);

  // Sector information based on sector type
  const sectorInfo = {
    Technology: {
      title: "Technology Sector",
      description:
        "The technology sector includes companies that develop software, hardware, and provide IT services. This sector is known for high growth potential but also higher volatility.",
      keyPoints: [
        "Innovation-driven industry with rapid growth",
        "High volatility but strong long-term potential",
        "Sensitive to market trends and consumer demand",
        "Often leads market rallies during bull markets",
      ],
      risks: [
        "Rapid technological changes can make products obsolete",
        "High competition and market saturation",
        "Regulatory changes can impact operations",
      ],
      opportunities: [
        "Digital transformation across industries",
        "Cloud computing and AI advancements",
        "Growing demand for software solutions",
      ],
    },
    Pharma: {
      title: "Pharmaceutical Sector",
      description:
        "The pharmaceutical sector includes companies that research, develop, and manufacture drugs and medical devices. This sector is essential for healthcare and often provides stable returns.",
      keyPoints: [
        "Essential industry with consistent demand",
        "Regulated by health authorities worldwide",
        "Research and development intensive",
        "Defensive sector during economic downturns",
      ],
      risks: [
        "Drug recalls and lawsuits can impact stock prices",
        "Patent expirations reduce revenue",
        "Regulatory approval delays",
      ],
      opportunities: [
        "Aging population increases demand",
        "Breakthrough treatments and innovations",
        "Global expansion opportunities",
      ],
    },
    Auto: {
      title: "Automotive Sector",
      description:
        "The automotive sector includes companies that manufacture vehicles, parts, and provide related services. The industry is evolving with electric and autonomous vehicles.",
      keyPoints: [
        "Cyclical industry tied to economic conditions",
        "Transitioning to electric vehicles",
        "Global supply chain dependencies",
        "Consumer spending sensitive",
      ],
      risks: [
        "Economic recessions reduce demand",
        "Supply chain disruptions",
        "Regulatory changes (emissions, safety)",
      ],
      opportunities: [
        "Electric vehicle market expansion",
        "Autonomous driving technology",
        "Emerging market growth",
      ],
    },
    Finance: {
      title: "Financial Sector",
      description:
        "The financial sector includes banks, insurance companies, and investment firms. This sector is heavily regulated and sensitive to interest rates and economic conditions.",
      keyPoints: [
        "Interest rate sensitive",
        "Regulated by financial authorities",
        "Economic cycle dependent",
        "Dividend-paying sector",
      ],
      risks: [
        "New regulations can impact profitability",
        "Interest rate changes affect margins",
        "Credit defaults during recessions",
      ],
      opportunities: [
        "Digital banking transformation",
        "Growing middle class in emerging markets",
        "Financial inclusion initiatives",
      ],
    },
    "Green Energy": {
      title: "Green Energy Sector",
      description:
        "The green energy sector includes companies focused on renewable energy sources like solar, wind, and hydroelectric power. This sector is growing rapidly with government support.",
      keyPoints: [
        "Government-backed growth sector",
        "Environmental sustainability focus",
        "Rising demand for clean energy",
        "Technology cost reductions improving margins",
      ],
      risks: [
        "Policy changes can impact subsidies",
        "Weather-dependent energy generation",
        "Initial high capital requirements",
      ],
      opportunities: [
        "Global climate change initiatives",
        "Falling renewable energy costs",
        "Energy storage technology advances",
      ],
    },
  };

  // Generate candlestick data from stock history
  const generateCandlestickData = () => {
    if (!stock || !stock.history || stock.history.length === 0) return [];

    const data = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - stock.history.length);

    stock.history.forEach((closePrice, index) => {
      // Generate OHLC data from close price (deterministic based on index)
      const volatility = closePrice * 0.02; // 2% volatility
      // Use a simple hash function based on index for deterministic randomness
      const seed = (index * 17 + closePrice) % 100;
      const randomFactor = (seed / 100) - 0.5; // -0.5 to 0.5
      
      const open =
        index === 0
          ? closePrice
          : stock.history[index - 1] + randomFactor * volatility;
      const high = Math.max(open, closePrice) + Math.abs(randomFactor) * volatility;
      const low = Math.min(open, closePrice) - Math.abs(randomFactor) * volatility;
      const close = closePrice;

      const date = new Date(baseDate);
      date.setDate(date.getDate() + index);
      date.setHours(9, 30, 0, 0); // Market open time

      data.push({
        x: date.getTime(),
        y: [
          Math.round(open),
          Math.round(high),
          Math.round(low),
          Math.round(close),
        ],
      });
    });

    return data;
  };

  const candlestickData = generateCandlestickData();
  const sectorData = stock ? sectorInfo[stock.sector] || sectorInfo.Technology : null;

  const chartOptions = {
    series: [
      {
        name: "Price",
        data: candlestickData,
      },
    ],
    chart: {
      type: "candlestick",
      height: 500,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    title: {
      text: stock ? `${stock.name} - Candlestick Chart` : "Candlestick Chart",
      align: "left",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#fff",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: "#fff",
        },
        formatter: (value) => `₹${value}`,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981", // Green for up
          downward: "#ef4444", // Red for down
        },
      },
    },
    theme: {
      mode: "dark",
    },
    grid: {
      borderColor: "#374151",
    },
  };

  if (!stock) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4 border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/stock-trader-game")}
              className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-white/10 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stock.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{stock.name}</h2>
                <p className="text-blue-200">{stock.sector} Sector</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Sector Information */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">
                {sectorData.title}
              </h3>
              <p className="text-white/80 mb-4">{sectorData.description}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                📊 Key Characteristics
              </h3>
              <ul className="space-y-2">
                {sectorData.keyPoints.map((point, index) => (
                  <li
                    key={index}
                    className="text-white/80 flex items-start gap-2"
                  >
                    <span className="text-green-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-500/10 backdrop-blur-lg rounded-xl p-6 border border-red-400/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                ⚠️ Risks to Consider
              </h3>
              <ul className="space-y-2">
                {sectorData.risks.map((risk, index) => (
                  <li
                    key={index}
                    className="text-white/80 flex items-start gap-2"
                  >
                    <span className="text-red-400 mt-1">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/10 backdrop-blur-lg rounded-xl p-6 border border-green-400/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                🚀 Growth Opportunities
              </h3>
              <ul className="space-y-2">
                {sectorData.opportunities.map((opp, index) => (
                  <li
                    key={index}
                    className="text-white/80 flex items-start gap-2"
                  >
                    <span className="text-green-400 mt-1">•</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Current Stock Info */}
            <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-6 border border-blue-400/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                💹 Current Stock Info
              </h3>
              <div className="space-y-2 text-white/80">
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <span className="font-bold text-white">₹{stock.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ticker:</span>
                  <span className="font-bold text-white">
                    {stock.ticker || stock.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price History Points:</span>
                  <span className="font-bold text-white">
                    {stock.history?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Candlestick Chart */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="h-full">
              {candlestickData.length > 0 ? (
                <Chart
                  options={chartOptions}
                  series={chartOptions.series}
                  type="candlestick"
                  height={500}
                />
              ) : (
                <div className="flex items-center justify-center h-[500px] text-white/60">
                  <p>No chart data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorDetailPage;

