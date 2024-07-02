import React, { ChangeEvent, useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { Engagement } from "../../../Interface/interface";

const options = {
  height: 360,
  bar: { groupWidth: "50%" },
  legend: { position: "none" },
  hAxis: {
    title: "Count",
    textStyle: {
      color: "#333",
      fontSize: 12,
    },
    titleTextStyle: {
      color: "#333",
      fontSize: 14,
      bold: true,
    },
    gridlines: {
      color: "transparent",
    },
  },
  vAxis: {
    textStyle: {
      color: "#333",
      fontSize: 12,
    },
    titleTextStyle: {
      color: "#333",
      fontSize: 14,
      bold: true,
    },
    gridlines: {
      color: "#e0e0e0",
    },
  },
};

type SectionThreeProp = {
  premiumUsers: number;
  normalUsers: number;
  engagements: Engagement[] | null;
};

const SectionThree: React.FC<SectionThreeProp> = ({
  premiumUsers,
  normalUsers,
  engagements,
}: SectionThreeProp) => {
  const [engagmentData, setEngagmentData] = useState<any[]>([
    ["Element", "Density", { role: "style" }],
    ["", 0, ""],
  ]);

  useEffect(() => {
    // Set default data for "day" when component mounts
    if (engagements) {
      const currentDate = new Date();
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const engagementsOfDay = engagements.filter((engagement) => {
        const createdAtDate = new Date(engagement.createdAt);
        return createdAtDate >= startOfDay && createdAtDate <= endOfDay;
      });

      if (engagementsOfDay.length > 0) {
        setEngagmentData([
          ["Element", "Density", { role: "style" }],
          ["Posts", engagementsOfDay[0]?.postCount || 0, ""],
          ["Follows", engagementsOfDay[0]?.followConut || 0, ""],
          ["Likes", engagementsOfDay[0]?.likeConut || 0, ""],
          ["Comment", engagementsOfDay[0]?.commentCount || 0, ""],
        ]);
      }
    }
  }, [engagements]);

  const handleChange = (type: string) => {
    let newData: any[][] = [["Element", "Density", { role: "style" }]];

    if (type === "week" && engagements) {
      const currentDay = new Date();
      const startOfWeek = new Date(
        currentDay.setDate(currentDay.getDate() - currentDay.getDay())
      ); // Start of current week (Sunday)
      const endOfWeek = new Date(
        currentDay.setDate(currentDay.getDate() - currentDay.getDay() + 6)
      ); // End of current week (Saturday)

      const engagementsOfWeek = engagements.filter((engagement) => {
        const createdAtDate = new Date(engagement.createdAt);
        return (
          createdAtDate >= startOfWeek && createdAtDate <= endOfWeek
        );
      });

      if (engagementsOfWeek.length > 0) {
        newData.push(
          ["Posts", engagementsOfWeek[0]?.postCount || 0, ""],
          ["Follows", engagementsOfWeek[0]?.followConut || 0, ""],
          ["Likes", engagementsOfWeek[0]?.likeConut || 0, ""],
          ["Comment", engagementsOfWeek[0]?.commentCount || 0, ""]
        );
      }
    } else if (type === "month" && engagements) {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ); // Start of current month
      const endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ); // End of current month

      const engagementsOfMonth = engagements.filter((engagement) => {
        const createdAtDate = new Date(engagement.createdAt);
        return (
          createdAtDate >= startOfMonth && createdAtDate <= endOfMonth
        );
      });

      if (engagementsOfMonth.length > 0) {
        newData.push(
          ["Posts", engagementsOfMonth[0]?.postCount || 0, ""],
          ["Follows", engagementsOfMonth[0]?.followConut || 0, ""],
          ["Likes", engagementsOfMonth[0]?.likeConut || 0, ""],
          ["Comment", engagementsOfMonth[0]?.commentCount || 0, ""]
        );
      }
    }

    setEngagmentData(newData);
  };

  return (
    <div className="mt-16 flex flex-col lg:flex-row z-0 h-auto m-5 p-6 rounded-lg bg-white">
      <div className="w-full lg:w-1/2 mb-5 lg:mb-0">
        <div className="flex">
          <p className="text-xl m-5 font-bold">User Engagement</p>
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleChange(e.target.value)
            }
            id="periodSelector"
            className="bg-gray-50 border-none focus:outline-none text-gray-900 text-sm rounded-lg"
          >
            <option value="day" selected>
              Day
            </option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <Chart
          options={options}
          className="w-full"
          chartType="ColumnChart"
          height="400px"
          data={engagmentData}
        />
      </div>
      <div className="w-full lg:w-1/2">
        <p className="text-xl m-5 font-bold">Premium and Normal</p>
        <Chart
          chartType="PieChart"
          data={[
            ["", ""],
            ["Premium", premiumUsers],
            ["Normal", normalUsers],
          ]}
          options={options}
          width={"100%"}
          height={"400px"}
        />
      </div>
    </div>
  );
};

export default SectionThree;
