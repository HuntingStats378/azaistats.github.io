import Odometer from 'odometer-counter';
import SuperJSON from 'superjson';

let odometer = new Odometer({
	el: document.querySelector('#count'),
	value: 0,
});
let odometer2 = new Odometer({
	el: document.querySelector('#count2'),
	value: 0,
});
import * as Highcharts from "highcharts";
const chartOptions: Highcharts.Options = {
  chart: {
    type: "line", // We explicitly set the chart type to 'line'
    renderTo: "graph", // The ID of the HTML element where the chart will be rendered
  },
  xAxis: {
    type: "datetime"
  },
  yAxis: {
  },
  tooltip: {
  },
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true, // Show the actual data value on the line
      },
      enableMouseTracking: true, // Allow hover effects
    },
  },
  series: [
    {
      // A series represents a line on your chart
      name: "est",
      // Data can be numbers for simple Y-values,
      // or arrays/objects for more complex data points
      data: [],
      // The type property is crucial for TypeScript to know the structure of this series
      type: "line",
    },
    {
      name: "linear",
      data: [],
      type: "line",
    },
  ],
};
const chartOptions2: Highcharts.Options = {
  chart: {
    type: "area", // We explicitly set the chart type to 'line'
    renderTo: "graph2", // The ID of the HTML element where the chart will be rendered
  },
  xAxis: {
    type: "datetime"
  },
  yAxis: {
  },
  tooltip: {
  },
  plotOptions: {
    area: {
      threshold: null,
      dataLabels: {
        enabled: true, // Show the actual data value on the line
      },
      enableMouseTracking: true, // Allow hover effects
    },
  },
  series: [
    {
      // A series represents a line on your chart
      name: "dif",
      // Data can be numbers for simple Y-values,
      // or arrays/objects for more complex data points
      data: [],
      // The type property is crucial for TypeScript to know the structure of this series
      type: "area",
    },
  ],
};

// 2. Create the chart instance
const graph = Highcharts.chart(chartOptions);
const graph2 = Highcharts.chart(chartOptions2);

async function get_data() {
	const data = await fetch(
		'/api/channel/' +
			(new URL(window.location.href).searchParams.get('id') ||
				'UCq-Fj5jknLsUf-MWSy4_brA'),
	)
		.then((resp) => resp.text())
		.then((res) => SuperJSON.parse(res)) as {
      linear_est_count: number;
      estimated_sub_count: number;
    };
	console.log(data);
  const date = Date.now();
	odometer.update(Math.floor(data.estimated_sub_count));
  graph.series[0]?.addPoint([date, Math.floor(data.estimated_sub_count)]);
	odometer2.update(Math.floor(data.linear_est_count));
  graph.series[1]?.addPoint([date, Math.floor(data.linear_est_count)]);
  graph2.series[0]?.addPoint([date, Math.floor(data.estimated_sub_count)-Math.floor(data.linear_est_count)]);
}
get_data();
setInterval(get_data, 2000);
