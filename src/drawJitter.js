export function drawJitter(selection, options) {
  console.log('drawJitter() was called');

  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;
  const xScale = options.xScale;
  const yScale = options.yScale;

  selection.attr('r', chartOptions.datapoints.radius)
    .attr('fill', d => colorScale(d[chartOptions.data.color_index]))
    .attr('cx', (/* d */) => {
      const w = xScale.bandwidth();
      return Math.floor(Math.random() * w);
    })
    .attr('cy', d => yScale(d[chartOptions.axes.y.label]));
}
