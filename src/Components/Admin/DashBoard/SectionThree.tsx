import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Element", "Density", { role: "style" }],
  ["Gold", 19.3, "gold"],
  ["Green", 8.94, "green"],
  ["Blue", 10.49, "blue"], 
];

const options = {
  height: 360,
  bar: { groupWidth: "50%" },
  legend: { position: "none" },
  hAxis: {
    title: 'Density',
    textStyle: {
      color: '#333',
      fontSize: 12,
    },
    titleTextStyle: {
      color: '#333',
      fontSize: 14,
      bold: true,
    },
    gridlines: {
      color: 'transparent'
    }
  },
  vAxis: {
    textStyle: {
      color: '#333',
      fontSize: 12,
    },
    titleTextStyle: {
      color: '#333',
      fontSize: 14,
      bold: true,
    },
    gridlines: {
      color: '#e0e0e0'
    }
  },
};

export const data2 = [
  ["Pizza", "Popularity"],
  ["Premium", 15],
  ["Normal", 56],

];

export const options2 = {
  sliceVisibilityThreshold: 0.2, // 20%
};
function SectionThree() {
  return (
    <div className="mt-16 flex flex-col lg:flex-row z-0 h-auto m-5 p-6 rounded-lg bg-white">
      <div className="w-full lg:w-1/2 mb-5 lg:mb-0">
        <h2 className="text-2xl m-5 font-bold">User Engagement</h2>
        <Chart
          options={options}
          className="w-full"
          chartType="ColumnChart"
          height="400px"
          data={data}
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl m-5 font-bold">Premium and Normal</h2>
         <Chart
      chartType="PieChart"
      data={data2}
      options={options2}
      width={"100%"}
      height={"400px"}
    />
      </div>
    </div>
  );
}

export default SectionThree;
