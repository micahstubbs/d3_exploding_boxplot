import * as d3 from 'd3';

export function createJitter(...args) {
  // console.log('createJitter() was called');
  const selector = this;
  // console.log('selection from createJitter', selector;
  // console.log('args from createJitter', args);

  d3.select(selector) 
    .append('g')
    .attr('class', 'explodingBoxplot outliers-points');

  d3.select(selector)
    .append('g')
    .attr('class', 'explodingBoxplot normal-points'); 

  d3.select(selector)
    .append('g')
    .attr('class', 'explodingBoxplot all-points');
}
