import * as d3 from 'd3';

export function createJitter() {
  console.log('createJitter() was called');
  const selector = this;
  console.log('this from createJitter', this);

  d3.select(selector)
    .append('g')
    .attr('class', 'explodingBoxplot outliers-points');

  d3.select(selector)
    .append('g')
    .attr('class', 'explodingBoxplot normal-points');
}
