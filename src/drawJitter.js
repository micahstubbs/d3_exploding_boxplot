export function drawJitter(selection, options) {
  console.log('drawJitter() was called');

  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;
  const xScale = options.xScale;
  const yScale = options.yScale;

  let boxWidth;
  if (typeof chartOptions.display.maxBoxWidth !== 'undefined') {
    boxWidth = chartOptions.display.maxBoxWidth;
  } else {
    boxWidth = xScale.bandwidth();
  }

  const boxWidthScale = d3.scaleLinear()
    .range(0, boxWidth);

  selection
    .attr('r', chartOptions.dataPoints.radius)
    .attr('fill', d => colorScale(d[chartOptions.data.colorIndex]))
    .attr('cx', (d, i) => {
      const w = boxWidth;
      if (false) {
        return chartOptions.dataPoints.radius * i;
      } else {
        return Math.floor(Math.random() * w);
      } 
    })
    .attr('cy', d => yScale(d[chartOptions.axes.y.variable]));
}
