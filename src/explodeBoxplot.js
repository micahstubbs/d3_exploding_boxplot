import { hideBoxplot } from './hideBoxplot';
import { initJitter } from './initJitter';
import { drawJitter } from './drawJitter';
import * as d3 from 'd3';

export function explodeBoxplot(i, options) {
  console.log('explodeBoxplot() was called');

  const xScale = options.xScale;
  const yScale = options.yScale;
  const colorScale = options.colorScale;
  const chartOptions = options.chartOptions;
  const events = options.events;
  const constituents = options.constituents;
  const transitionTime = options.transitionTime;
  const groups = options.groups;

  const hideBoxplotOptions = {
    xScale,
    yScale
  };

  d3.select(`#explodingBoxplot${chartOptions.id}${i}`)
    .select('g.box').transition()
    .ease(d3.ease('back-in'))
    .duration((transitionTime * 1.5))
    .call(hideBoxplot, hideBoxplotOptions);

  const explodeNormal = d3.select(`#explodingBoxplot${chartOptions.id}${i}`)
    .select('.normal-points')
    .selectAll('.point')
    .data(groups[i].normal);
  explodeNormal.enter()
    .append('circle');
  explodeNormal.exit()
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

  explodeNormal
    .attr('cx', xScale.rangeBand() * 0.5)
    .attr('cy', yScale(groups[i].quartiles[1]))
    .call(initJitter, initJitterOptions)
    .transition()
    .ease(d3.ease('back-out'))
    .delay(() => (transitionTime * 1.5) + (100 * Math.random()))
    .duration(() => (transitionTime * 1.5) + ((transitionTime * 1.5) * Math.random()))
    .call(drawJitter, drawJitterOptions);
}
