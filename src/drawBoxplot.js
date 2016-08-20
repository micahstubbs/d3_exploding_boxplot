import { jitterPlot } from './jitterPlot';
import { explodeBoxplot } from './explodeBoxplot';
import * as d3 from 'd3';

export function drawBoxplot(d, i, options, state) {
  console.log('drawBoxplot() was called');
  const chartOptions = options.chartOptions; // TODO: better names here
  const transitionTime = options.transitionTime;
  const xScale = options.xScale;
  const yScale = options.yScale;
  const colorScale = options.colorScale;
  const groups = options.groups;
  const events = options.events;
  const constituents = options.constituents;

  const explodeBoxplotOptions = {
    xScale,
    yScale,
    colorScale,
    chartOptions,
    events,
    constituents,
    transitionTime,
    groups
  };
  const s = d3.select(`#explodingBoxplot_box${chartOptions.id}${i}`)
    .on('click', (/* d */) => {
      explodeBoxplot(i, explodeBoxplotOptions);
      state.explodedBoxplots.push(i);
      // console.log('state.explodedBoxplots', state.explodedBoxplots);
    });

  // const s = d3.select(this);
  if (state.explodedBoxplots.indexOf(i) >= 0) {
    explodeBoxplot(i, explodeBoxplotOptions);
    jitterPlot(i, chartOptions);
    return;
  }

  // console.log('s from drawBoxplot', s);
  const jitterPlotOptions = {
    chartOptions,
    colorScale,
    xScale,
    yScale,
    groups,
    events,
    constituents,
    transitionTime
  };

  jitterPlot(i, jitterPlotOptions);

  // box
  s.select('rect.box')
    .transition()
      .duration(transitionTime)
      .attr('x', 0)
      .attr('width', xScale.bandwidth())
      .attr('y', e => yScale(e.quartiles[2]))
      .attr('height', e => yScale(e.quartiles[0]) - yScale(e.quartiles[2]))
      .attr('fill', e => colorScale(e.normal[0][chartOptions.data.color_index]));

  // median line
  s.select('line.median')
    .transition()
      .duration(transitionTime)
      .attr('x1', 0).attr('x2', xScale.bandwidth())
      .attr('y1', e => yScale(e.quartiles[1]))
      .attr('y2', e => yScale(e.quartiles[1]));

  // min line
  s.select('line.min.hline')
    .transition()
      .duration(transitionTime)
      .attr('x1', xScale.bandwidth() * 0.25)
      .attr('x2', xScale.bandwidth() * 0.75)
      .attr('y1', e => yScale(Math.min(e.min, e.quartiles[0])))
      .attr('y2', e => yScale(Math.min(e.min, e.quartiles[0])));

  // min vline
  s.select('line.min.vline')
    .transition()
      .duration(transitionTime)
      .attr('x1', xScale.bandwidth() * 0.5)
      .attr('x2', xScale.bandwidth() * 0.5)
      .attr('y1', e => yScale(Math.min(e.min, e.quartiles[0])))
      .attr('y2', e => yScale(e.quartiles[0]));

  // max line
  s.select('line.max.hline')
    .transition()
      .duration(transitionTime)
      .attr('x1', xScale.bandwidth() * 0.25)
      .attr('x2', xScale.bandwidth() * 0.75)
      .attr('y1', e => yScale(Math.max(e.max, e.quartiles[2])))
      .attr('y2', e => yScale(Math.max(e.max, e.quartiles[2])));

  // max vline
  s.select('line.max.vline')
    .transition()
      .duration(transitionTime)
      .attr('x1', xScale.bandwidth() * 0.5)
      .attr('x2', xScale.bandwidth() * 0.5)
      .attr('y1', e => yScale(e.quartiles[2]))
      .attr('y2', e => yScale(Math.max(e.max, e.quartiles[2])));
}
