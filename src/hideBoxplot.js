export function hideBoxplot(g, options) {
  console.log('hideBoxplot() was called');

  // console.log('arguments', arguments);
  const s = this;
  const xScale = options.xScale;
  const yScale = options.yScale;

  s.select('rect.box')
    .attr('x', xScale.bandwidth() * 0.5)
    .attr('width', 0)
    .attr('y', d => yScale(d.quartiles[1]))
    .attr('height', 0);

  // median line
  s.selectAll('line')
    .attr('x1', xScale.bandwidth() * 0.5)
    .attr('x2', xScale.bandwidth() * 0.5)
    .attr('y1', d => yScale(d.quartiles[1]))
    .attr('y2', d => yScale(d.quartiles[1]));
}
