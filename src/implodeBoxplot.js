import * as d3 from 'd3';

export function implodeBoxplot(selector, data, options) {
  const xScale = options.xScale;
  const yScale = options.yScale;
  const transitionTime = options.transitionTime;
  const drawBoxplot = options.drawBoxplot;

  const explodedBoxPlots = [];
  selector.selectAll('.normal-points')
    .each(function (g) {
      d3.select(this)
        .selectAll('circle')
        .transition()
        .ease(d3.ease('back-out'))
        .duration(() => (transitionTime * 1.5) + ((transitionTime * 1.5) * Math.random()))
        .attr('cx', xScale.rangeBand() * 0.5)
        .attr('cy', yScale(g.quartiles[1]))
        .remove();
    });

  selector.selectAll('.boxcontent')
    .transition()
    .ease(d3.ease('back-out'))
    .duration((transitionTime * 1.5))
    .delay(transitionTime)
    .each(drawBoxplot);
}