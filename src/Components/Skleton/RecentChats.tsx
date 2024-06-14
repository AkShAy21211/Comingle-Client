import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

function RecentChats() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <div className="w-3/12 animate-pulse">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className={`w-full h-16 mb-2 rounded-md ${
            isDarkMode ? "bg-gray-600" : "bg-gray-400"
          }`}
        ></div>
      ))}
    </div>
  );
}

export default RecentChats;
