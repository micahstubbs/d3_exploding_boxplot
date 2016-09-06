export function hideBoxplot(d, options) {
  // console.log('hideBoxplot() was called');

  // console.log('arguments from hideBoxplot()', arguments);
  const xScale = options.xScale;
  const yScale = options.yScale;
  const chartOptions = options.chartOptions;

  let boxWidth;
  if (typeof chartOptions.display.maxBoxWidth !== 'undefined') {
    boxWidth = chartOptions.display.maxBoxWidth;
  } else {
    boxWidth = xScale.bandwidth();
  }

  d.select('rect.box')
    .attr('x', boxWidth * 0.5)
    .attr('width', 0)
    .attr('y', e => yScale(e.quartiles[1]))
    .attr('height', 0);

  // median line
  d.selectAll('line')
    .attr('x1', boxWidth * 0.5)
    .attr('x2', boxWidth * 0.5)
    .attr('y1', e => yScale(e.quartiles[1]))
    .attr('y2', e => yScale(e.quartiles[1]));
}
