export function jitterPlot(i, options) {
  const elem = d3.select(`#explodingBoxplot${options.id}${i}`)
    .select('.outliers-points');

  const displayOutliers = elem.selectAll('.point')
    .data(groups[i].outlier);

  displayOutliers.enter()
    .append('circle');

  displayOutliers.exit()
    .remove();

  displayOutliers
    .attr('cx', xScale.rangeBand() * 0.5)
    .attr('cy', yScale(groups[i].quartiles[1]))
    .call(initJitter)
    .transition()
    .ease(d3.ease('back-out'))
    .delay(() => (transitionTime * 1.5) + (100 * Math.random()))
    .duration(() => (transitionTime * 1.5) + ((transitionTime * 1.5) * Math.random()))
    .call(drawJitter);
}
