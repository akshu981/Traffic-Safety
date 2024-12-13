const w = 700;  
const h = 400;
const margin = { top: 25, right: 20, bottom: 70, left: 100 };
const innerWidth = w - margin.left - margin.right;
const innerHeight = h - margin.top - margin.bottom;

const data = [
  { year: 1994, fatal_crashes: 36254 },
  { year: 1995, fatal_crashes: 37241 },
  { year: 1996, fatal_crashes: 37494 },
  { year: 1997, fatal_crashes: 37324 },
  { year: 1998, fatal_crashes: 37107 },
  { year: 1999, fatal_crashes: 37140 },
  { year: 2000, fatal_crashes: 37526 },
  { year: 2001, fatal_crashes: 37682 },
  { year: 2002, fatal_crashes: 38491 },
  { year: 2003, fatal_crashes: 38477 },
  { year: 2004, fatal_crashes: 38444 },
  { year: 2005, fatal_crashes: 39252 },
  { year: 2006, fatal_crashes: 38648 },
  { year: 2007, fatal_crashes: 37435 },
  { year: 2008, fatal_crashes: 34172 },
  { year: 2009, fatal_crashes: 30862 },
  { year: 2010, fatal_crashes: 30296 },
  { year: 2011, fatal_crashes: 29867 },
  { year: 2012, fatal_crashes: 31006 },
  { year: 2013, fatal_crashes: 30202 },
  { year: 2014, fatal_crashes: 30056 },
  { year: 2015, fatal_crashes: 32538 },
  { year: 2016, fatal_crashes: 34748 },
  { year: 2017, fatal_crashes: 34560 },
  { year: 2018, fatal_crashes: 33919 },
  { year: 2019, fatal_crashes: 33487 },
  { year: 2020, fatal_crashes: 35935 },
  { year: 2021, fatal_crashes: 39785 },
  { year: 2022, fatal_crashes: 39221 },
];

const svg = d3.select("div#plot")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

const xScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.year))  
  .range([0, innerWidth])
  .nice(); 

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.fatal_crashes) / 1000])  
  .range([innerHeight, 0]);

const line = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.fatal_crashes / 1000));

const plotGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

plotGroup.append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2);

plotGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.year))
  .attr("cy", d => yScale(d.fatal_crashes / 1000))
  .attr("r", 5)
  .attr("fill", "steelblue")
  .on("click", function(event, d) {
    showValueOnClick(event, d);
  });

const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("d")); 
const yAxis = d3.axisLeft(yScale)  
  .tickFormat(d => d3.format(",")(d)); 

plotGroup.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${innerHeight})`)
  .call(xAxis);

plotGroup.append("g")
  .attr("class", "y-axis")
  .call(yAxis);

svg.append("text")
  .attr("x", w / 2)
  .attr("y", margin.top - 10)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .text("Fatal Crashes Over the Years");

svg.append("text")
  .attr("x", w / 2)
  .attr("y", h - margin.bottom + 30)
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .text("Year");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -h / 2)  
  .attr("y", margin.left - 30)  
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .text("Fatal Crashes (in thousands)");  

let previousClicked = null;

function showValueOnClick(event, d) {
  plotGroup.selectAll(".value-label").remove();
  plotGroup.selectAll(".background-rect").remove();
  
  if (previousClicked === d) {
    previousClicked = null;
    return;  
  }

  previousClicked = d;

  const labelX = w / 2; 
  const labelY = h - margin.bottom - 50;  
  const labelText = `Year: ${d.year}, Crashes: ${d.fatal_crashes}`;

  const rectWidth = labelText.length * 8;  
  
  const background = plotGroup.append("rect")
    .attr("class", "background-rect")
    .attr("x", labelX - rectWidth / 2)  
    .attr("y", labelY - 15)
    .attr("width", rectWidth)
    .attr("height", 20)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 1); 

  plotGroup.append("text")
    .attr("class", "value-label")
    .attr("x", labelX)  
    .attr("y", labelY)  
    .attr("font-size", "12px")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text(labelText);
}

document.getElementById("calculate").addEventListener("click", function () {
  const year1 = parseInt(document.getElementById("year1").value); // Year 1 (e.g., 1995)
  const year2 = parseInt(document.getElementById("year2").value); // Year 2 (e.g., 2020)

  const resultDiv = document.getElementById("result");

  // Find the fatal crashes for the input years
  const year1Data = data.find((d) => d.year === year1);
  const year2Data = data.find((d) => d.year === year2);

  if (!year1Data || !year2Data) {
    resultDiv.textContent = "Invalid year(s) entered. Please enter years between 1994 and 2022.";
    return;
  }

  const year1Crashes = year1Data.fatal_crashes;
  const year2Crashes = year2Data.fatal_crashes;

  // Log the values for debugging
  console.log(`Fatal crashes in ${year1}:`, year1Crashes);
  console.log(`Fatal crashes in ${year2}:`, year2Crashes);

  // Calculate the percent change
  if (year1Crashes !== 0) {
    const percentChange = ((year2Crashes - year1Crashes) / year1Crashes) * 100;

    if (percentChange > 0) {
      resultDiv.textContent = `Percent Change: ${percentChange.toFixed(2)}% (increase)`;
    } else if (percentChange < 0) {
      resultDiv.textContent = `Percent Change: ${percentChange.toFixed(2)}% (decrease)`;
    } else {
      resultDiv.textContent = "No change in fatal crashes between the two years.";
    }
  } else {
    resultDiv.textContent = "Fatal crashes for Year 1 cannot be zero.";
  }
});