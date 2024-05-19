import React from 'react'
import { Chart } from "react-google-charts";

 const data = [
  [
    "Element",
    "Total",
    { role: "style" },
    {
      sourceColumn: 0,
      role: "annotation",
      type: "string",
      calc: "stringify",
    },
  ],
  ["15-25", 18.94, "gold", null],
  ["26-35", 10.49, "gold", null],
  ["35+", 5.3, "gold", null],
];

 const options = {
   height: 260,
  bar: { groupWidth: "50%" },
  legend: { position: "none" },
  zindex:"1",
  hAxis: {
    title: 'Age Range',
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
function SectionTwo() {
  return (
     <div className="mt-10  z-0 h-80 m-5   p-6 rounded-lg">
              <h2 className="text-2xl m-5 font-bold">User By Age</h2>

      <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
      
    </div>
  )
}

export default SectionTwo
