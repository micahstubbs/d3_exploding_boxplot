import { hideBoxplot } from './hideBoxplot';
import { initJitter } from './initJitter';
import { drawJitter } from './drawJitter';
import * as d3 from 'd3';

export function explodeBoxplot(i, options) {
  // console.log('explodeBoxplot() was called');

  const xScale = options.xScale;
  const yScale = options.yScale;
  const colorScale = options.colorScale;
  const chartOptions = options.chartOptions;
  const events = options.events;
  const constituents = options.constituents;
  const transitionTime = options.transitionTime;
  const groups = options.groups;
  const chartWrapper = options.chartWrapper;

  const hideBoxplotOptions = {
    xScale,
    yScale,
    chartOptions
  };

  chartWrapper.select(`#explodingBoxplot${chartOptions.id}${i}`)
    .select('g.box').transition()
    .ease(d3.easeBackIn)
    .duration((transitionTime * 1.5))
    .call(hideBoxplot, hideBoxplotOptions);

  const explodeNormal = chartWrapper.select(`#explodingBoxplot${chartOptions.id}${i}`)
    .select('.normal-points')
    .selectAll('.point');

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
  }

  let boxWidth;
  if (typeof chartOptions.display.maxBoxWidth !== 'undefined') {
    boxWidth = chartOptions.display.maxBoxWidth;
  } else {
    boxWidth = xScale.bandwidth();
  }

  explodeNormal
    .attr('visibility', 'visible')
    .attr('cx', boxWidth * 0.5)
    .attr('cy', yScale(groups[i].quartiles[1]))
    .call(initJitter, initJitterOptions)
    .transition()
    .ease(d3.easeBackOut)
    .delay(() => (transitionTime * 1.5) + (100 * Math.random()))
    .duration(() => (transitionTime * 1.5) + ((transitionTime * 1.5) * Math.random()))
    .call(drawJitter, drawJitterOptions);
}
