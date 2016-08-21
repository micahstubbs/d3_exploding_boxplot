export function hideBoxplot(d, options) {
  // console.log('hideBoxplot() was called');

  // console.log('arguments from hideBoxplot()', arguments);
  const xScale = options.xScale;
  const yScale = options.yScale;

  d.select('rect.box')
    .attr('x', xScale.bandwidth() * 0.5)
    .attr('width', 0)
    .attr('y', e => yScale(e.quartiles[1]))
    .attr('height', 0);

  // median line
  d.selectAll('line')
    .attr('x1', xScale.bandwidth() * 0.5)
    .attr('x2', xScale.bandwidth() * 0.5)
    .attr('y1', e => yScale(e.quartiles[1]))
    .attr('y2', e => yScale(e.quartiles[1]));
}
