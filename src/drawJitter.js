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

  selection.attr('r', chartOptions.dataPoints.radius)
    .attr('fill', d => colorScale(d[chartOptions.data.colorIndex]))
    .attr('cx', (/* d */) => {
      const w = boxWidth;
      return Math.floor(Math.random() * w);
    })
    .attr('cy', d => yScale(d[chartOptions.axes.y.variable]));
}
