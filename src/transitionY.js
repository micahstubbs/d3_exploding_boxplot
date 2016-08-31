import { computeBoxplot } from './computeBoxplot';
import { jitterPlot } from './jitterPlot';
import * as d3 from 'd3';

export function transitionY(data, options) {
  // a version of the update function that 
  // transitions the y-position of existing elements

  const chartOptions = options.chartOptions;
  const transitionTime = options.transitionTime;
  const selection = options.selection;
  const boxPlotWidth = options.boxPlotWidth;
  const events = options.events;
  const constituents = options.constituents;

  const margin = chartOptions.margin;
  const yDomain = chartOptions.axes.y.domain;


  if (typeof yDomain === 'undefined') {
    console.error('options.axes.y.domain must be defined in order to transition the Y series');
    return;
  }

  // create our groups or classes
  // from our specified categorical grouping variable
  // console.log('chartOptions.data.group', chartOptions.data.group);
  let groups;
  if (chartOptions.data.group) {
    groups = d3.nest()
      .key(k => k[chartOptions.data.group])
      .entries(data);
  } else {
    groups = [{
      key: '',
      values: data
    }];
  }
  const groupsKeys = groups.map(d => d.key);

  const xScale = d3.scaleBand()
    .domain(groupsKeys) 
    .padding(chartOptions.display.boxPadddingProportion)
    .rangeRound(
      [0, boxPlotWidth /* - margin.left - margin.right*/]
    );

  // compute new boxplot data with the new yVariable
  // for each group or class
  groups = groups.map(g => {
    console.log('chartOptions from inside of groups map', chartOptions);
    const computeBoxplotOptions = { chartOptions };
    const o = computeBoxplot(g.values, computeBoxplotOptions);
    o.group = g.key;
    return o;
  });
  console.log('groups after map', groups);

  // x-scale remains the same

  // ???
  // y-scale
  // may need to alter the update function that does
  // the initial render to use the global extent
  // across all the y-variables we might like to
  // transition too later
  // this would alter the domain of the y-scale in 
  // the update function
  const yScale = d3.scaleLinear()
    .range([chartOptions.height - margin.top - margin.bottom, 0]);

  if (typeof yDomain !== 'undefined') {
    yScale
      .domain(yDomain)
      .nice();
  } else {
    yScale
      .domain(d3.extent(data.map(d => d[chartOptions.axes.y.variable])))
      .nice();

    // if yDomain is undefined,
    // transition y-axis as well
    // TODO: transition y-axis
  };

  // color scale remains the same
  // calculate color scale here inside of transitionY
  const colors = chartOptions.boxColors;

  const colorScale = d3.scaleOrdinal()
    .domain(d3.set(data.map(d => d[chartOptions.data.colorIndex])).values())
    .range(Object.keys(colors).map(d => colors[d]));

  // ???
  // reset the implodeBoxplot() event handler
  // with new options?

  // if the box is not exploded
  // transition box rect and lines y-position
  groups.forEach((group, i) => {
    const currentBoxplotBoxSelector = `#explodingBoxplot_box${chartOptions.id}${i}`;
    const s = selection.select(currentBoxplotBoxSelector);

    // transition box
    s.select('rect.box')
      .transition()
        .duration(transitionTime)
        .attr('y', () => yScale(group.quartiles[2]))
        .attr('height', () => yScale(group.quartiles[0]) - yScale(group.quartiles[2]));

    // median line
    s.select('line.median')
      .transition()
        .duration(transitionTime)
        .attr('y1', () => yScale(group.quartiles[1]))
        .attr('y2', () => yScale(group.quartiles[1]));

    // min line
    s.select('line.min.hline')
      .transition()
        .duration(transitionTime)
        .attr('y1', () => yScale(Math.min(group.min, group.quartiles[0])))
        .attr('y2', () => yScale(Math.min(group.min, group.quartiles[0])));

    // min vline
    s.select('line.min.vline')
      .transition()
        .duration(transitionTime)
        .attr('y1', () => yScale(Math.min(group.min, group.quartiles[0])))
        .attr('y2', () => yScale(group.quartiles[0]));

    // max line
    s.select('line.max.hline')
      .transition()
        .duration(transitionTime)
        .attr('y1', () => yScale(Math.max(group.max, group.quartiles[2])))
        .attr('y2', () => yScale(Math.max(group.max, group.quartiles[2])));

    // max vline
    s.select('line.max.vline')
      .transition()
        .duration(transitionTime)
        .attr('y1', () => yScale(group.quartiles[2]))
        .attr('y2', () => yScale(Math.max(group.max, group.quartiles[2])));

    // // remove all points
    // s.selectAll('circle')
    //   .transition()
    //   .style('fill-opacity', 0)
    //   .remove();

    // re-draw all points from new groups data
    const jitterPlotOptions = {
      chartOptions,
      colorScale,
      xScale,
      yScale,
      groups,
      events,
      constituents,
      transitionTime,
      chartWrapper: selection
    };

    jitterPlot(i, jitterPlotOptions);
  })
}