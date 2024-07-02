import { Chart } from "react-google-charts";


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

type SectionTwoPro={

  ageRoup:{'<15':number,'15-25':number,'26-35':number,'35+':number};
}

function SectionTwo({ageRoup}:SectionTwoPro) {


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
  ["<15", ageRoup['<15'], "gold", null],
  ["15-25", ageRoup['15-25'], "gold", null],
  ["25-35", ageRoup['26-35'], "gold", null],
  ["35+",ageRoup['35+'], "gold", null],
];


  return (
     <div className="mt-10  z-0 h-80 m-5   p-6 rounded-lg">
              <p className="text-xl m-5 font-bold">User By Age</p>

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
