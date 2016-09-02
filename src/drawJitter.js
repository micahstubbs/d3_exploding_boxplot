import * as d3 from 'd3';

export function drawJitter(selection, options) {
  console.log('drawJitter() was called');

  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;
  const xScale = options.xScale;
  const yScale = options.yScale;
  const group = options.group;
  const pointsType = options.pointsType;
  console.log('group from drawJitter', group);

  let boxWidth;
  if (typeof chartOptions.display.maxBoxWidth !== 'undefined') {
    boxWidth = chartOptions.display.maxBoxWidth;
  } else {
    boxWidth = xScale.bandwidth();
  }
  console.log('boxWidth from drawJitter', boxWidth);
  // console.log('group[`${pointsType}`].length', group[`${pointsType}`].length - 1);

  const boxWidthScale = d3.scaleLinear()
    .domain([0, group[`${pointsType}`].length - 1])
    .range([0, boxWidth]);

  selection
    .attr('r', chartOptions.dataPoints.radius)
    .attr('fill', d => colorScale(d[chartOptions.data.colorIndex]))
    .attr('cx', (d, i) => {
      console.log('i from drawJitter', i);
      const w = boxWidth;
      if (true) {
        console.log('boxWidthScale(i)', boxWidthScale(i));
        return boxWidthScale(i);
      } else {
        return Math.floor(Math.random() * w);
      } 
    })
    .attr('cy', d => yScale(d[chartOptions.axes.y.variable]));
}
