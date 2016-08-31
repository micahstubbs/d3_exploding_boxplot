import { drawBoxplot } from './drawBoxplot';
import * as d3 from 'd3';

export function implodeBoxplot(selector, options, state) {
  console.log('implodeBoxplot() was called');
  const xScale = options.xScale;
  const yScale = options.yScale;
  const transitionTime = options.transitionTime;
  const colorScale = options.colorScale;
  const chartOptions = options.chartOptions;
  const groups = options.groups;
  const events = options.events;
  const constituents = options.constituents;
  const chartWrapper = options.chartWrapper;

  let boxWidth;
  if (typeof chartOptions.display.maxBoxWidth !== 'undefined') {
    boxWidth = chartOptions.display.maxBoxWidth;
  } else {
    boxWidth = xScale.bandwidth();
  }

  state.explodedBoxplots = [];
  console.log('state.explodedBoxplots', state.explodedBoxplots);
  selector.selectAll('.normal-points')
    .each(function (g) {
      d3.select(this)
        .selectAll('circle')
        .transition()
          .ease(d3.easeBackOut)
          .duration(() => (transitionTime * 1.5) + ((transitionTime * 1.5) * Math.random()))
          .attr('cx', boxWidth * 0.5)
          .attr('cy', yScale(g.quartiles[1]))
          .attr('visibility', 'hidden');
          // .remove();
    });

  selector.selectAll('.boxcontent')
    .classed('exploded', false)
    .transition()
      .ease(d3.easeBackOut)
      .duration((transitionTime * 1.5))
      .delay(transitionTime)
      .each((d, i) => {
        const drawBoxplotOptions = {
          chartOptions,
          transitionTime,
          xScale,
          yScale,
          colorScale,
          groups,
          events,
          constituents,
          chartWrapper
        };
        drawBoxplot(d, i, drawBoxplotOptions, state);
      });
}
