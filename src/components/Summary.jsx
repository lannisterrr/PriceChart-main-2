import React from "react";

const Summary = ({ coinData }) => {
  if (!coinData || !coinData.coin.description || !coinData.coin.description) {
    return null;
  }

  const summaryText = coinData.coin.description.slice(0, 150) + "...";

  return (
    <div className="">
      <div className="mb-4">
        <h3 className="font-bold text-lg">Summary</h3>
        <p>{summaryText}</p>
      </div>
      <div
        className="overflow-y-scroll h-72 whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: coinData.coin.description }}
      ></div>
    </div>
  );
};

export default Summary;
