import { computeBoxplot } from './computeBoxplot';
import * as d3 from 'd3';

export function transitionY(data, options) {
  // a version of the update function that 
  // transitions the y-position of existing elements
  // and update the visibility
  // no new elements are added or removed

  const chartOptions = options.chartOptions;
  const transitionTime = options.transitionTime;
  const selection = options.selection;
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

    // transition y-axis as well
    // TODO: transition y-axis
  };



  // color scale remains the same

  // ???
  // reset the implodeBoxplot() event handler
  // with new options?

  groups.forEach((group, i) => {
    const currentBoxplotBoxSelector = `#explodingBoxplot_box${chartOptions.id}${i}`;
    const s = selection.select(currentBoxplotBoxSelector);
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
  })
  // if the box is not exploded
    // transition box rect and lines y-position
    

    // hide all points that are now normal points
    // show all points that are now outlier points
    // transition all points to new y-position

  // if the box is exploded
    // transition all points to new y-position

}