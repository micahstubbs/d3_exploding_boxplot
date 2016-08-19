export function createBoxplot(selector, data, options) {
  console.log('createBoxplot() was called');

  // console.log('selector from createBoxplot', selector);
  // console.log('d3.select(selector)', d3.select(selector));
  const i = options.i;
  const g = data;
  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;

  // console.log('this from createBoxplot', this);
  const s = d3.select(selector).append('g')
    .attr('class', 'explodingBoxplot box')
    .attr('id', `explodingBoxplot_box${chartOptions.id}${i}`)
    .selectAll('.box')
    .data([g])
    .enter();

  s.append('rect')
    .attr('class', 'explodingBoxplot box')
    .attr('fill', d => colorScale(d.normal[0][chartOptions.data.color_index]));

  s.append('line').attr('class', 'explodingBoxplot median line');    // median line
  s.append('line').attr('class', 'explodingBoxplot min line hline'); // min line
  s.append('line').attr('class', 'explodingBoxplot line min vline'); // min vline
  s.append('line').attr('class', 'explodingBoxplot max line hline'); // max line
  s.append('line').attr('class', 'explodingBoxplot line max vline'); // max vline
}