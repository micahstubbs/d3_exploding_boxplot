import { initJitter } from './initJitter';
import { drawJitter } from './drawJitter';
import * as d3 from 'd3';

export function jitterPlot(i, options) {
  console.log('jitterPlot() was called');

  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;
  const xScale = options.xScale;
  const yScale = options.yScale;
  const groups = options.groups;
  const events = options.events;
  const constituents = options.constituents;
  const transitionTime = options.transitionTime;

  const elem = d3.select(`#explodingBoxplot${chartOptions.id}${i}`)
    .select('.outliers-points');

  const displayOutliers = elem.selectAll('.point')
    .data(groups[i].outlier);

  // displayOutliers.enter()
  //   .append('circle');

  displayOutliers.exit()
    .remove();

  const drawJitterOptions = {
    chartOptions,
    colorScale,
    xScale,
    yScale
  };

  const initJitterOptions = {
    chartOptions,
    colorScale,
    events,
    constituents
  };

  displayOutliers
    .enter()
    .append('circle')
    .merge(displayOutliers)
      .attr('cx', xScale.bandwidth() * 0.5)
      .attr('cy', yScale(groups[i].quartiles[1]))
      .call(initJitter, initJitterOptions)
      .transition()
      .ease(d3.easeBackOut)
      .delay(() => (transitionTime * 1.5) + (100 * Math.random()))
      .duration(() => (transitionTime * 1.5) + ((transitionTime * 1.5) * Math.random()))
      .call(drawJitter, drawJitterOptions);
}
