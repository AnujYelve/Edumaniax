import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Shield,
  BookOpen,
  Trophy,
  Play,
  BarChart3,
  Newspaper,
  ArrowRight,
  ArrowLeft,
  Home,
  Star,
  Brain,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { usePerformance } from "@/contexts/PerformanceContext"; // for performance
import { useFinance } from "@/contexts/FinanceContext";

const StockTraderGame = () => {
  const { completeFinanceChallenge } = useFinance();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("intro");
  const [currentDay, setCurrentDay] = useState(1);
  const [cash, setCash] = useState(50000);
  const [portfolio, setPortfolio] = useState({});
  const [gameData, setGameData] = useState({});
  const [finalResults, setFinalResults] = useState(null);
  const [notifications, setNotifications] = useState([]);

  //for performance
  const { updatePerformance } = usePerformance();
  const [startTime, setStartTime] = useState(Date.now());

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

  const newsEvents = [
    {
      day: 2,
      stock: "TECHZ",
      news: "TechZon reports record profits!",
      impact: 0.15,
      type: "positive",
    },
    {
      day: 3,
      stock: "MEDIC",
      news: "MediCore sued for drug recall",
      impact: -0.12,
      type: "negative",
    },
    {
      day: 4,
      stock: "DRIVE",
      news: "DriveUp launches electric car line",
      impact: 0.18,
      type: "positive",
    },
    {
      day: 5,
      stock: "BANKR",
      news: "Banking sector faces new regulations",
      impact: -0.08,
      type: "negative",
    },
    {
      day: 6,
      stock: "ECON",
      news: "Government backs green energy initiative",
      impact: 0.22,
      type: "positive",
    },
  ];

  const initializeGame = () => {
    setGameData({
      stocks: { ...initialStocks },
      dayNews: null,
      trades: [],
    });
  };

  // Restore game state when returning from sector detail page
  useEffect(() => {
    const savedGameState = localStorage.getItem("stockTraderGameState");
    if (savedGameState) {
      try {
        const state = JSON.parse(savedGameState);
        if (state.currentPage === "game") {
          setCurrentPage("game");
          setCurrentDay(state.currentDay || 1);
          setCash(state.cash || 50000);
          setPortfolio(state.portfolio || {});
          // Restore gameData, and ensure stocks are initialized
          if (state.gameData && state.gameData.stocks) {
            setGameData(state.gameData);
          } else {
            // If gameData is missing, initialize it
            initializeGame();
          }
          setStartTime(state.startTime || Date.now());
          // Clear the saved state after restoring
          localStorage.removeItem("stockTraderGameState");
        }
      } catch (e) {
        console.error("Error restoring game state:", e);
        localStorage.removeItem("stockTraderGameState");
      }
    }
  }, []);

  useEffect(() => {
    if (currentPage === "game" && !gameData.stocks) {
      initializeGame();
    }
  }, [currentPage]);

  const calculateSMA = (prices, period = 5) => {
    if (prices.length < period) return prices[prices.length - 1];
    const recent = prices.slice(-period);
    return recent.reduce((sum, price) => sum + price, 0) / period;
  };

  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period) return 50;
    let gains = 0,
      losses = 0;
    for (let i = 1; i < period + 1; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    const rs = gains / losses;
    return 100 - 100 / (1 + rs);
  };

  const nextDay = () => {
    if (currentDay >= 7) {
      calculateFinalResults();
      completeFinanceChallenge(0, 1); // ✅ Mark challenge complete
      setCurrentPage("results");
      return;
    }

    const newDay = currentDay + 1;
    const todayNews = newsEvents.find((event) => event.day === newDay);

    const updatedStocks = { ...gameData.stocks };

    // Apply news impact
    if (todayNews) {
      const stock = updatedStocks[todayNews.stock];
      const newPrice = Math.round(stock.price * (1 + todayNews.impact));
      stock.price = newPrice;
      stock.history.push(newPrice);
    }

    // Random market movement for all stocks
    Object.keys(updatedStocks).forEach((ticker) => {
      if (!todayNews || todayNews.stock !== ticker) {
        const stock = updatedStocks[ticker];
        const change = (Math.random() - 0.5) * 0.1; // ±5% random change
        const newPrice = Math.round(stock.price * (1 + change));
        stock.price = Math.max(10, newPrice); // Minimum price of ₹10
        stock.history.push(stock.price);
      }
    });

    setGameData((prev) => ({
      ...prev,
      stocks: updatedStocks,
      dayNews: todayNews,
    }));

    setCurrentDay(newDay);
  };

  const calculateFinalResults = () => {
    let totalValue = cash;
    Object.entries(portfolio).forEach(([ticker, quantity]) => {
      totalValue += gameData.stocks[ticker].price * quantity;
    });

    const profit = totalValue - 50000;
    const profitPercent = (profit / 50000) * 100;
    const winRate = calculateWinRate();
    const totalTrades = gameData.trades.length;

    const endTime = Date.now();
    const studyTimeMinutes = Math.round((endTime - startTime) / 60000);
    const totalTimeMs = endTime - startTime;
    const avgResponseTimeSec = Math.round(totalTimeMs / (7 * 1000)); // simple average for 7 days

    // Scale score out of 10 and accuracy out of 100
    const score = Math.min(10, Math.max(0, (profitPercent / 10).toFixed(1))); // cap between 0–10
    const accuracy = winRate; // already in %

    // 🔁 Update performance
    updatePerformance({
      moduleName: "Finance",
      topicName: "investorLevel",
      score: Number(score),
      accuracy: Number(accuracy),
      studyTimeMinutes,
      avgResponseTimeSec,
      completed: true,
    });

    setFinalResults({
      totalValue,
      profit,
      profitPercent,
      trades: totalTrades,
      winRate,
    });
  };
  // Replace your existing calculateWinRate function with this corrected version:

  const calculateWinRate = () => {
    const sellTrades = gameData.trades.filter(
      (trade) => trade.action === "SELL"
    );

    if (sellTrades.length === 0) {
      return 0; // No sell trades yet, so 0% win rate
    }

    let profitableTrades = 0;

    sellTrades.forEach((sellTrade) => {
      // Find the most recent buy trade for the same stock before this sell
      const buyTrades = gameData.trades.filter(
        (trade) =>
          trade.ticker === sellTrade.ticker &&
          trade.action === "BUY" &&
          trade.day <= sellTrade.day
      );

      if (buyTrades.length > 0) {
        // Get the most recent buy trade
        const buyTrade = buyTrades[buyTrades.length - 1];

        // If sell price is higher than buy price, it's profitable
        if (sellTrade.price > buyTrade.price) {
          profitableTrades++;
        }
      }
    });

    return Math.round((profitableTrades / sellTrades.length) * 100);
  };

  const restartGame = () => {
    setCurrentPage("intro");
    setCurrentDay(1);
    setCash(50000);
    setPortfolio({});
    setGameData({});
    setFinalResults(null);
    setStartTime(Date.now());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, currentDay]);

  // Intro Page Component
  const IntroPage = () => (
    <div className="min-h-screen w-[90%] mx-auto mt-5 mb-5 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="animate-bounce mb-8">
          <div className="text-8xl mb-4">📈</div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
          The Stock Trader Challenge
        </h1>

        <p className="text-xl md:text-2xl text-purple-200 mb-8 animate-fade-in">
          Can you beat the market in 7 days? 🚀
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="flex flex-col items-center p-4 bg-blue-500/20 rounded-2xl hover:scale-105 transition-transform">
              <DollarSign className="w-12 h-12 mb-2 text-yellow-400" />
              <h3 className="text-lg font-bold">₹50,000</h3>
              <p className="text-sm text-center">Starting Capital</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-green-500/20 rounded-2xl hover:scale-105 transition-transform">
              <BarChart3 className="w-12 h-12 mb-2 text-green-400" />
              <h3 className="text-lg font-bold">5 Stocks</h3>
              <p className="text-sm text-center">Different Sectors</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-red-500/20 rounded-2xl hover:scale-105 transition-transform">
              <Trophy className="w-12 h-12 mb-2 text-red-400" />
              <h3 className="text-lg font-bold">7 Days</h3>
              <p className="text-sm text-center">Trading Challenge</p>
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            📋 Game Rules & Scoring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90 text-sm">
            <div className="space-y-2">
              <p>
                <strong>🎯 Objective:</strong> Maximize your portfolio value in
                7 days
              </p>
              <p>
                <strong>💰 Starting Cash:</strong> ₹50,000 to invest
              </p>
              <p>
                <strong>📊 Final Score:</strong> Cash + Stock Holdings value
              </p>
              <p>
                <strong>📈 Profit/Loss:</strong> Final Value - ₹50,000
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong>🏆 Win Rate:</strong> % of profitable sell trades
              </p>
              <p>
                <strong>📰 News Impact:</strong> Breaking news affects stock
                prices daily
              </p>
              <p>
                <strong>📉 Indicators:</strong> Use SMA & RSI for trading
                decisions
              </p>
              <p>
                <strong>⚡ Strategy:</strong> Buy low, sell high, diversify
                risk!
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            {Object.values(initialStocks).map((stock) => (
              <span
                key={stock.name}
                className="px-4 py-2 bg-white/10 rounded-full text-white border border-white/20 hover:bg-white/20 transition-colors"
              >
                {stock.icon} {stock.name}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentPage("game")}
          className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-2 mx-auto animate-pulse"
        >
          <Play className="w-6 h-6" />
          Enter the Exchange
        </button>
      </div>
    </div>
  );

  // Game Page Component
  const GamePage = () => (
    <div className="min-h-screen w-[90%] mx-auto mt-5 mb-5 rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-2 sm:p-4">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage("intro")}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Day {currentDay}/7
              </h1>
              <p className="text-blue-200">Stock Market Challenge</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-400/30">
              <div className="text-green-400 font-bold text-lg">
                Cash: ₹{cash.toLocaleString()}
              </div>
            </div>
            <div className="bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-400/30">
              <div className="text-blue-400 font-bold text-lg">
                Portfolio: ₹
                {(
                  cash +
                  Object.entries(portfolio).reduce(
                    (sum, [ticker, qty]) =>
                      sum + (gameData.stocks?.[ticker]?.price || 0) * qty,
                    0
                  )
                ).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Alert */}
      {gameData.dayNews && (
        <div
          className={`mb-4 p-4 rounded-2xl border-2 animate-bounce ${
            gameData.dayNews.type === "positive"
              ? "bg-green-500/20 border-green-400 text-green-100"
              : "bg-red-500/20 border-red-400 text-red-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Breaking News!</h3>
              <p>{gameData.dayNews.news}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stock Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {gameData.stocks &&
          Object.entries(gameData.stocks).map(([ticker, stock]) => (
            <StockCard
              key={ticker}
              ticker={ticker}
              stock={stock}
              portfolio={portfolio}
              onBuy={buyStock}
              onSell={sellStock}
              onCardClick={(ticker, stock) => {
                // Store stock data in localStorage for the new page
                localStorage.setItem(`stock_${ticker}`, JSON.stringify(stock));
                // Save current game state so we can restore it when coming back
                const gameState = {
                  currentPage,
                  currentDay,
                  cash,
                  portfolio,
                  gameData,
                  startTime,
                };
                localStorage.setItem("stockTraderGameState", JSON.stringify(gameState));
                // Navigate to sector detail page in the same tab
                navigate(`/stock-trader-game/sector/${ticker}`);
              }}
            />
          ))}
      </div>

      {/* Next Day Button */}
      <div className="text-center">
        <button
          onClick={nextDay}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2 mx-auto"
        >
          {currentDay >= 7 ? "Finish Game" : "Next Day"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Stock Card Component
  const StockCard = ({ ticker, stock, portfolio, onBuy, onSell, onCardClick }) => {
    const [quantity, setQuantity] = useState(1);
    const holdings = portfolio[ticker] || 0;
    const sma = calculateSMA(stock.history);
    const rsi = calculateRSI(stock.history);
    const priceChange =
      stock.history[stock.history.length - 1] -
      stock.history[stock.history.length - 2];
    const priceChangePercent =
      (priceChange / stock.history[stock.history.length - 2]) * 100;

    const handleCardClick = (e) => {
      // Don't trigger if clicking on buttons, inputs, or their children
      if (
        e.target.closest("button") ||
        e.target.closest("input") ||
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "INPUT"
      ) {
        return;
      }
      onCardClick(ticker, stock);
    };

    return (
      <div
        className={`bg-gradient-to-br ${stock.color} p-1 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer`}
        onClick={handleCardClick}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stock.icon}</span>
                <div>
                  <h3 className="text-white font-bold text-lg">{stock.name}</h3>
                  <p className="text-white/70 text-sm">{ticker}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-xl">₹{stock.price}</div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  priceChange >= 0 ? "text-green-800" : "text-red-800"
                }`}
              >
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {priceChangePercent.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Chart Placeholder */}
          {/* <div className="bg-white/5 rounded-lg p-3 mb-4">
            <div className="flex items-end justify-between h-16 gap-1">
              {stock.history.slice(-7).map((price, idx) => (
                <div
                  key={idx}
                  className="bg-white/30 rounded-sm flex-1 hover:bg-white/50 transition-colors"
                  style={{
                    height: `${
                      (price / Math.max(...stock.history.slice(-7))) * 100
                    }%`,
                  }}
                  title={`₹${price}`}
                />
              ))}
            </div>
          </div> */}

          {/* Indicators */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-white/70 text-xs">SMA (5)</div>
              <div className="text-white font-bold">₹{sma.toFixed(0)}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-white/70 text-xs">RSI</div>
              <div
                className={`font-bold ${
                  rsi > 70
                    ? "text-red-300"
                    : rsi < 30
                    ? "text-green-300"
                    : "text-white"
                }`}
              >
                {rsi.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Holdings */}
          {holdings > 0 && (
            <div className="bg-yellow-500/20 rounded-lg p-2 mb-4 border border-yellow-400/30">
              <div className="text-yellow-200 text-sm">
                You own: {holdings} shares
              </div>
              <div className="text-yellow-100 font-bold">
                Value: ₹{(holdings * stock.price).toLocaleString()}
              </div>
            </div>
          )}

          {/* Trading Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-white text-sm">Qty:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="bg-white/10 border border-white/30 rounded-lg px-3 py-1 text-white text-center w-20 focus:outline-none focus:border-white/50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onBuy(ticker, quantity)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <TrendingUp className="w-4 h-4" />
                Buy
              </button>
              <button
                onClick={() => onSell(ticker, quantity)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <TrendingDown className="w-4 h-4" />
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Results Page Component
  const ResultsPage = () => (
    <div className="min-h-screen w-[90%] mx-auto mt-5 mb-5 rounded-xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="text-8xl mb-4">
            {finalResults?.profit > 0
              ? "🎉"
              : finalResults?.profit < -5000
              ? "😅"
              : "😊"}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
          Challenge Complete!
        </h1>

        {finalResults && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white mb-8">
              <div className="bg-green-500/20 rounded-2xl p-6 border border-green-400/30">
                <DollarSign className="w-12 h-12 mb-2 text-green-400 mx-auto" />
                <h3 className="text-2xl font-bold">
                  ₹{finalResults.totalValue.toLocaleString()}
                </h3>
                <p className="text-green-200">Final Portfolio</p>
              </div>

              <div
                className={`rounded-2xl p-6 border ${
                  finalResults.profit >= 0
                    ? "bg-blue-500/20 border-blue-400/30"
                    : "bg-red-500/20 border-red-400/30"
                }`}
              >
                <Trophy className="w-12 h-12 mb-2 text-yellow-400 mx-auto" />
                <h3
                  className={`text-2xl font-bold ${
                    finalResults.profit >= 0 ? "text-blue-200" : "text-red-200"
                  }`}
                >
                  {finalResults.profit >= 0 ? "+" : ""}₹
                  {finalResults.profit.toLocaleString()}
                </h3>
                <p
                  className={
                    finalResults.profit >= 0 ? "text-blue-200" : "text-red-200"
                  }
                >
                  {finalResults.profitPercent.toFixed(1)}% Return
                </p>
              </div>

              <div className="bg-purple-500/20 rounded-2xl p-6 border border-purple-400/30">
                <BarChart3 className="w-12 h-12 mb-2 text-purple-400 mx-auto" />
                <h3 className="text-2xl font-bold">{finalResults.trades}</h3>
                <p className="text-purple-200">Total Trades</p>
              </div>

              <div className="bg-yellow-500/20 rounded-2xl p-6 border border-yellow-400/30">
                <Target className="w-12 h-12 mb-2 text-yellow-400 mx-auto" />
                <h3 className="text-2xl font-bold">{finalResults.winRate}%</h3>
                <p className="text-yellow-200">Win Rate</p>
              </div>
            </div>

            {/* Badges */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Achievements Unlocked!
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {finalResults.profit > 10000 && (
                  <div className="bg-gold-500/20 px-4 py-2 rounded-full border border-yellow-400/50 text-yellow-200">
                    🏆 Big Winner
                  </div>
                )}
                {finalResults.trades >= 10 && (
                  <div className="bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/50 text-blue-200">
                    📊 Active Trader
                  </div>
                )}
                {finalResults.winRate >= 60 && (
                  <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-400/50 text-green-200">
                    🎯 Strategic Mind
                  </div>
                )}
                <div className="bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/50 text-purple-200">
                  🎓 Market Graduate
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2 justify-center"
          >
            <Play className="w-5 h-5" />
            Play Again
          </button>

          <button
            onClick={() => setCurrentPage("education")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2 justify-center"
          >
            <BookOpen className="w-5 h-5" />
            Learn More
          </button>
        </div>
      </div>
    </div>
  );

  // Education Page Component
  const EducationPage = () => (
    <div className="min-h-screen w-[90%] mx-auto mt-5 mb-5 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => setCurrentPage("results")}
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📚 Stock Trading Basics
          </h1>
          <p className="text-xl text-purple-200">
            Learn the fundamentals of smart investing!
          </p>
        </div>

        {/* Education Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              📈 Technical Analysis
            </h3>
            <div className="text-white/80 space-y-3">
              <p>
                <strong>Moving Average (SMA):</strong> Shows average price over
                time. When price is above SMA, it's often bullish!
              </p>
              <p>
                <strong>RSI (Relative Strength):</strong> Measures if a stock is
                overbought (70) or oversold (30).
              </p>
              <p>
                <strong>Candlestick Charts:</strong> Show open, high, low, close
                prices for each day.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              📰 News Impact
            </h3>
            <div className="text-white/80 space-y-3">
              <p>
                <strong>Positive News:</strong>earnings, partnerships boost
                prices.
              </p>
              <p>
                <strong>Negative News:</strong> Lawsuits, recalls, poor earnings
                drag prices down.
              </p>
              <p>
                <strong>Market Timing:</strong> Buy rumors, sell news. React
                quickly to breaking stories!
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              💰 Risk Management
            </h3>
            <div className="text-white/80 space-y-3">
              <p>
                <strong>Diversification:</strong> Don't put all money in one
                stock. Spread the risk!
              </p>
              <p>
                <strong>Position Sizing:</strong> Never risk more than 10% on a
                single trade.
              </p>
              <p>
                <strong>Stop Losses:</strong> Exit losing trades early to
                preserve capital.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🎯 Trading Strategies
            </h3>
            <div className="text-white/80 space-y-3">
              <p>
                <strong>Trend Following:</strong> Buy when prices are rising,
                sell when falling.
              </p>
              <p>
                <strong>Mean Reversion:</strong> Buy oversold stocks, sell
                overbought ones.
              </p>
              <p>
                <strong>News Trading:</strong> React quickly to breaking news
                for quick profits.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Quiz Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            🧠 Quick Quiz
          </h3>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white font-semibold mb-3">
                Q1: When RSI is above 70, the stock is:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button className="bg-blue-500/20 hover:bg-blue-500/40 text-white p-2 rounded-lg border border-blue-400/30 transition-all">
                  A. Oversold
                </button>
                <button className="bg-green-500/20 hover:bg-green-500/40 text-white p-2 rounded-lg border border-green-400/30 transition-all">
                  B. Overbought ✓
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white font-semibold mb-3">
                Q2: What's the best strategy for beginners?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button className="bg-green-500/20 hover:bg-green-500/40 text-white p-2 rounded-lg border border-green-400/30 transition-all">
                  A. Diversification ✓
                </button>
                <button className="bg-blue-500/20 hover:bg-blue-500/40 text-white p-2 rounded-lg border border-blue-400/30 transition-all">
                  B. All-in trading
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            💡 Pro Tips for Kids
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Start Small</h4>
                <p className="text-sm">
                  Practice with small amounts first, just like learning to ride
                  a bike!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Stay Safe</h4>
                <p className="text-sm">
                  Never invest money you can't afford to lose.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Keep Learning</h4>
                <p className="text-sm">
                  The more you know, the better decisions you'll make!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Set Goals</h4>
                <p className="text-sm">
                  Decide what you want to achieve before you start trading.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            Try Trading Again!
          </button>
        </div>
      </div>
    </div>
  );

  // Toast notification system
  const showNotification = (message, type = "info") => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const buyStock = (ticker, quantity) => {
    const stock = gameData.stocks[ticker];
    const cost = stock.price * quantity;

    if (cost > cash) {
      showNotification(
        "Not enough cash! 💸 You need more money to buy these shares.",
        "error"
      );
      return;
    }

    setCash((prev) => prev - cost);
    setPortfolio((prev) => ({
      ...prev,
      [ticker]: (prev[ticker] || 0) + quantity,
    }));

    setGameData((prev) => ({
      ...prev,
      trades: [
        ...prev.trades,
        {
          day: currentDay,
          action: "BUY",
          ticker,
          quantity,
          price: stock.price,
        },
      ],
    }));

    showNotification(
      `🎉 Great! You bought ${quantity} shares of ${
        stock.name
      } for ₹${cost.toLocaleString()}!`,
      "success"
    );
  };

  const sellStock = (ticker, quantity) => {
    const holdings = portfolio[ticker] || 0;

    if (holdings === 0) {
      showNotification(
        "Oops! You don't own any shares of this stock yet! 📊 Buy some first!",
        "error"
      );
      return;
    }

    if (quantity > holdings) {
      showNotification(
        `You only have ${holdings} shares! 📉 You can't sell more than you own.`,
        "error"
      );
      return;
    }

    const stock = gameData.stocks[ticker];
    const revenue = stock.price * quantity;

    setCash((prev) => prev + revenue);
    setPortfolio((prev) => ({
      ...prev,
      [ticker]: prev[ticker] - quantity,
    }));

    setGameData((prev) => ({
      ...prev,
      trades: [
        ...prev.trades,
        {
          day: currentDay,
          action: "SELL",
          ticker,
          quantity,
          price: stock.price,
        },
      ],
    }));

    showNotification(
      `💰 Awesome! You sold ${quantity} shares of ${
        stock.name
      } for ₹${revenue.toLocaleString()}!`,
      "success"
    );
  };

  const Toast = ({ notification, onClose }) => (
    <div
      className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 max-w-sm ${
        notification.type === "success"
          ? "bg-green-500"
          : notification.type === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      } text-white animate-bounce`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="font-medium">{notification.message}</p>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="text-white hover:text-gray-200 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );

  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={(id) =>
            setNotifications((prev) => prev.filter((n) => n.id !== id))
          }
        />
      ))}
    </div>
  );

  // Main render logic
  const renderPage = () => {
    switch (currentPage) {
      case "intro":
        return <IntroPage />;
      case "game":
        return <GamePage />;
      case "results":
        return <ResultsPage />;
      case "education":
        return <EducationPage />;
      default:
        return <IntroPage />;
    }
  };

  return (
    <div className="relative">
      <NotificationContainer />
      {(() => {
        switch (currentPage) {
          case "intro":
            return <IntroPage />;
          case "game":
            return <GamePage />;
          case "results":
            return <ResultsPage />;
          case "education":
            return <EducationPage />;
          default:
            return <IntroPage />;
        }
      })()}
    </div>
  );
};

export default StockTraderGame;
