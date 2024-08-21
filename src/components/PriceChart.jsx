import React, { useState, useEffect } from "react";
import Summary from "./Summary";
import Chart from "./Chart";

const PriceChart = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [coins, setCoins] = useState([]);
  const [selectedCoinName, setSelectedCoinName] = useState("Select a Coin");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinData, setCoinData] = useState(null);
  const [activeTab, setActiveTab] = useState("Chart");

  // New state for updated price and price change
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-access-token": import.meta.env.VITE_API_URL_Api_Key,
        },
      };

      try {
        const response = await fetch(
          "https://api.coinranking.com/v2/coins?orderBy=price&limit=100",
          options
        );
        const data = await response.json();
        setCoins(data.data.coins || []);
      } catch (error) {
        console.error("Error fetching coins:", error);
        setCoins([]);
      }
    };

    fetchCoins();
  }, []);

  const fetchCoinData = async (coin) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-access-token": import.meta.env.VITE_API_URL_Api_Key,
      },
    };

    try {
      const response = await fetch(
        `https://api.coinranking.com/v2/coin/${coin.uuid}?timePeriod=30d`,
        options
      );
      const marketDataResponse = await fetch(
        `https://api.coinranking.com/v2/coin/${coin.uuid}`,
        options
      );
      const priceData = await response.json();
      const marketData = await marketDataResponse.json();
      setCoinData(priceData.data);
    } catch (error) {
      console.error("Error fetching coin details:", error);
    }
  };

  useEffect(() => {
    if (selectedCoinName !== "Select a Coin") {
      const selectedCoinObject = coins.find(
        (coin) => coin.name === selectedCoinName
      );
      if (selectedCoinObject) fetchCoinData(selectedCoinObject);
    }
  }, [selectedCoinName, coins]);

  const handleSelectCoin = (coin) => {
    setSelectedCoinName(coin.name);
    setSelectedCoin(coin);
    setShowMenu(false);
  };

  const handlePriceDataUpdate = (currentPrice, priceChange) => {
    setCurrentPrice(currentPrice);
    setPriceChange(priceChange);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg md:w-[730px] w-[400px] mx-auto">
      {/* Coin Information */}
      {coinData ? (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              {currentPrice || parseFloat(coinData.coin.price).toFixed(2)} USD
            </h2>
            <p
              className={`text-lg ${
                priceChange && parseFloat(priceChange) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {priceChange || `${coinData.coin.change}%`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">
              {parseFloat(
                coinData.coin.allTimeHigh.price.toLocaleString()
              ).toFixed(2)}{" "}
              (24h High)
            </p>
            <p className="text-gray-500 text-sm">
              {parseFloat(
                coinData.coin.allTimeHigh.price.toLocaleString()
              ).toFixed(2)}{" "}
              (24h Low)
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Select a coin to view data</p>
      )}

      {/* Toggle Menu */}
      <div className="relative mt-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="py-2 px-4 bg-gray-200 rounded-lg w-full text-left focus:outline-none"
        >
          {selectedCoinName}
          <span className="float-right">▼</span>
        </button>
        {showMenu && (
          <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 w-full max-h-60 overflow-y-auto">
            {Array.isArray(coins) && coins.length > 0 ? (
              coins.map((coin) => (
                <li
                  key={coin.uuid}
                  onClick={() => handleSelectCoin(coin)}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                >
                  {coin.name} ({coin.symbol.toUpperCase()})
                </li>
              ))
            ) : (
              <li className="py-2 px-4 text-center text-gray-500">
                No coins available
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-4 ">
        <ul className="flex  flex-wrap space-x-4 text-gray-500 border-b border-gray-200">
          <li
            className={`py-2 px-4 cursor-pointer ${
              activeTab === "Chart"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("Chart")}
          >
            Chart
          </li>
          <li
            className={`py-2 px-4 cursor-pointer ${
              activeTab === "Summary"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("Summary")}
          >
            Summary
          </li>
          <li className="py-2 px-4 cursor-pointer">Statistics</li>
          <li className="py-2 px-4 cursor-pointer">Analysis</li>
          <li className="py-2 px-4 cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      <div className="mt-4">
        {activeTab === "Chart" && coinData && (
          <Chart
            coinData={coinData}
            onPriceDataUpdate={handlePriceDataUpdate}
          />
        )}
        {activeTab === "Summary" && <Summary coinData={coinData} />}
      </div>
    </div>
  );
};

export default PriceChart;
