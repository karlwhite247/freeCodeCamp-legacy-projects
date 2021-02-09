const url =
  "https://raw.githubusercontent.com/karlwhite247/testable-projects-fcc/master/src/data/heat_map/heat_map.json";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const colors = [
  "#add8e6",
  "#9da7ef",
  "#8477f5",
  "#5b43fb",
  "#4a1af6",
  "#a860ca",
  "#d59d9b",
  "#f3da5e",
  "#fff600",
  "#ffde00",
  "#ffc700",
  "#ffaf00",
  "#ff9500",
  "#ff7800",
  "#ff5600",
  "#ff1f00",
  "#c51708",
  "#811b0c",
  "#421509",
  "#000000"
];

d3.json(url, (d) => {
  const height = 500;
  const width = 800;
  const padding = 50;
  const baseTemp = d.baseTemperature;
  const data = d.monthlyVariance;
  const lowTemp = d3.min(data, (d) => baseTemp - d.variance);
  const highTemp = d3.max(data, (d) => baseTemp - d.variance);

  //create tooltip element
  const tooltip = d3
    .select(".container")
    .append("div")
    .attr("class", "tooltip");

  const colorScale = d3.scaleQuantile().domain([lowTemp, 12]).range(colors);

  const chart = d3
    .select(".chart")
    .attr("height", height + padding * 2)
    .attr("width", width + 300)
    .append("g")
    .attr("transform", "translate(" + 150 + "," + padding + ")");

  const x = d3
    .scaleLinear()
    .range([0, width])
    .domain(d3.extent(data, (d) => d.year));
  const y = d3
    .scaleLinear()
    .range([0, height])
    .domain(d3.extent(data, (d) => d.month));

  // create axis
  const xAxis = d3.axisBottom().scale(x).ticks(10).tickFormat(d3.format(".4"));
  const yAxis = d3.axisLeft().scale(y).ticks(0);

  var yLabel = chart
    .selectAll(".yLabel")
    .data(months)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("x", 0)
    .attr("y", (d, i) => i * (height / 11))
    .style("text-anchor", "end")
    .attr("transform", "translate(-10," + 10 + ")")
    .attr("class", "yLabel");

  //Create group and append and style axis
  chart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + 525 + ")")
    .call(xAxis);
  chart.append("g").attr("class", "y axis").call(yAxis);

  chart
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (data) => x(data.year))
    .attr("y", (data) => y(data.month))
    .attr("width", 3)
    .attr("height", height / 12)
    .attr("transform", "translate(0, -20)")
    .style("fill", (d) => colorScale(baseTemp + d.variance))
    //Show tooltip on mouseover
    .on("mouseover", (data) => {
      d3.select(this).attr("class", "mouseover");
      let format = d3.format(".4");
      //append data into tooltip and style
      tooltip
        .style("opacity", 0.8)
        .html(
          "<span>" +
            months[data.month - 1] +
            " " +
            data.year +
            "</span><br><span>Temp: " +
            `${format(data.variance + baseTemp)}` +
            "&#8451</span>"
        )
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 60 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("class", "null");
    });
});