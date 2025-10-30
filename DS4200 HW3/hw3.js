// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
    const margin = {top: 50, right: 30, bottom: 50, left: 60}; // Increased top margin for title
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select("#boxplot")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales for x and y axes
    const ageGroups = [...new Set(data.map(d => d.AgeGroup))];
    
    const xScale = d3.scaleBand()
      .domain(ageGroups)
      .range([0, width])
      .padding(0.2); 

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Likes)]) 
      .range([height, 0]);
      
    // Color scale for boxes
    const boxColor = d3.scaleOrdinal()
      .domain(ageGroups)
      .range(["#4e79a7", "#f28e2c", "#e15759"]); // Added color

    // Add scales (axes)     
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Age Group");

    // Add y-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .text("Number of Likes");
        
    // Add Plot Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2)) // Position title in new margin
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Distribution of Likes by Age Group");

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const min = d3.min(values); 
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const max = d3.max(values);
        return {min, q1, median, q3, max};
    };

    // This line groups data by AgeGroup and calculates statistics (min, q1, median, q3, max) for each group using the rollupFunction.
    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.AgeGroup);

    // This line iterates through the calculated statistics for each AgeGroup, allowing us to draw a separate box plot for each one.
    quantilesByGroups.forEach((quantiles, AgeGroup) => {
        const x = xScale(AgeGroup);
        const boxWidth = xScale.bandwidth();
        const boxCenter = x + boxWidth / 2;

        // Draw vertical lines
        svg.append("line")
            .attr("x1", boxCenter)
            .attr("x2", boxCenter)
            .attr("y1", yScale(quantiles.min))
            .attr("y2", yScale(quantiles.max))
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Draw box
        svg.append("rect")
            .attr("x", x)
            .attr("y", yScale(quantiles.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(quantiles.q1) - yScale(quantiles.q3))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", boxColor(AgeGroup)); // Use color scale

        // Draw median line
        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(quantiles.median))
            .attr("y2", yScale(quantiles.median))
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    });
});

// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.AvgLikes = +d.AvgLikes;
    });

    // Define the dimensions and margins for the SVG
    // Increased right margin for legend, top for title
    const margin = {top: 50, right: 100, bottom: 50, left: 60}; 
    const width = 500 - margin.left - margin.right; // Width is smaller to make room
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select("#barplot")
      .append("svg")
        .attr("width", width + margin.left + margin.right) // Total width is still 500
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define four scales
    const platforms = [...new Set(data.map(d => d.Platform))];
    const postTypes = [...new Set(data.map(d => d.PostType))];

    const x0 = d3.scaleBand()
      .domain(platforms)
      .rangeRound([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(postTypes)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.AvgLikes)])
      .rangeRound([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(postTypes)
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);    
         
    // Add scales x0 and y     
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x0));

    svg.append("g")
      .call(d3.axisLeft(y));

    // Add x-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Platform");

    // Add y-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .text("Average Number of Likes");
        
    // Add Plot Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Average Likes by Platform and Post Type");


  // Group container for bars
    const barGroups = svg.selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  // Draw bars
    barGroups.append("rect")
      .attr("x", d => x1(d.PostType))
      .attr("y", d => y(d.AvgLikes))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.AvgLikes))
      .attr("fill", d => color(d.PostType));

    // Add the legend
    const legend = svg.append("g")
      // Position legend in the right margin
      .attr("transform", `translate(${width + 10}, 0)`); 

    const types = [...new Set(data.map(d => d.PostType))];
 
    types.forEach((type, i) => {

    // Alread have the text information for the legend. 
    // Now add a small square/rect bar next to the text with different color.
      legend.append("rect")
          .attr("x", 0)
          .attr("y", i * 20 + 2)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", color(type));

      legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 12)
          .text(type)
          .attr("alignment-baseline", "middle");
  });

});

// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.AvgLikes = +d.AvgLikes;
    });

    // Define the dimensions and margins for the SVG
    // Increased left margin to show label, top for title
    const margin = {top: 50, right: 30, bottom: 70, left: 70}; 
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select("#lineplot")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales for x and y axes  
    const xScale = d3.scalePoint()
      .domain(data.map(d => d.Date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.AvgLikes)])
      .range([height, 0]);

    // Draw the axis, you can rotate the text in the x-axis here
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-25)");

    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Date");

    // Add y-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .text("Average Number of Likes");
        
    // Add Plot Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Average Likes Over Time");

    // Draw the line and path. Remember to use curveNatural. 
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d.AvgLikes))
        .curve(d3.curveNatural)
      );

});