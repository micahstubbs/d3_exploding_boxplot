import * as d3 from 'd3';

export function initJitter(s, options) {
  // console.log('initJitter() was called');

  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;
  const events = options.events;
  const constituents = options.constituents;

  s
    .classed('explodingBoxplot point marks', true)
    .attr('r', chartOptions.dataPoints.radius)
    .attr('fill', d => colorScale(d[chartOptions.data.colorIndex]))
    .attr('fill-opacity', d =>  chartOptions.dataPoints.fillOpacity)
    .on('mouseover', function (d, i/* , self */) {
      if (events.point && typeof events.point.mouseover === 'function') {
        events.point.mouseover(d, i, d3.select(this), constituents, chartOptions);
      }
    })
    .on('mouseout', function (d, i/* , self */) {
      if (events.point && typeof events.point.mouseout === 'function') {
        events.point.mouseout(d, i, d3.select(this), constituents, chartOptions);
      }
    })
    .on('click', function (d, i/* , self */) {
      if (events.point && typeof events.point.click === 'function') {
        events.point.click(d, i, d3.select(this), constituents, chartOptions);
      }
    });
}
