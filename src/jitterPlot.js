export function jitterPlot(i, options) {
  console.log('jitterPlot() was called');

  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;
  const xScale = options.xScale;
  const yScale = options.yScale;

  const elem = d3.select(`#explodingBoxplot${options.id}${i}`)
    .select('.outliers-points');

  const displayOutliers = elem.selectAll('.point')
    .data(groups[i].outlier);

  displayOutliers.enter()
    .append('circle');

  displayOutliers.exit()
    .remove();

  const drawJitterOptions = {
    chartOptions: options,
    colorScale,
    xScale,
    yScale
  };

  displayOutliers
    .attr('cx', xScale.rangeBand() * 0.5)
    .attr('cy', yScale(groups[i].quartiles[1]))
    .call(initJitter)
    .transition()
    .ease(d3.ease('back-out'))
    .delay(() => (transitionTime * 1.5) + (100 * Math.random()))
    .duration(() => (transitionTime * 1.5) + ((transitionTime * 1.5) * Math.random()))
    .call(drawJitter, drawJitterOptions);
}
