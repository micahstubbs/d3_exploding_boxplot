import * as d3 from 'd3';

export function createBoxplot(selector, data, options) {
  console.log('createBoxplot() was called');

  console.log('selector from createBoxplot', selector);
  console.log('d3.select(selector)', d3.select(selector));
  const i = options.i;
  const g = data;
  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;

  // console.log('this from createBoxplot', this);
  const s = d3.select(selector).append('g')
    .attr('class', 'explodingBoxplot box')
    .attr('id', `explodingBoxplot_box${chartOptions.id}${i}`);
    // .selectAll('.box')
    // .data([g])
    // .enter();

  const createBoxplotSelection = s.selectAll('.box')
    .data([g]);

  createBoxplotSelection
    .enter()
    .append('rect')
    .merge(createBoxplotSelection)
      .attr('class', 'explodingBoxplot box')
      .attr('fill', d => {
        // console.log('d from createBoxplot', d);
        colorScale(d.normal[0][chartOptions.data.colorIndex])
      });

  const currentBoxplotBoxSelector = `#explodingBoxplot_box${chartOptions.id}${i}`;
  
  d3.select(currentBoxplotBoxSelector).append('line').attr('class', 'explodingBoxplot median line');    // median line
  d3.select(currentBoxplotBoxSelector).append('line').attr('class', 'explodingBoxplot min line hline'); // min line
  d3.select(currentBoxplotBoxSelector).append('line').attr('class', 'explodingBoxplot line min vline'); // min vline
  d3.select(currentBoxplotBoxSelector).append('line').attr('class', 'explodingBoxplot max line hline'); // max line
  d3.select(currentBoxplotBoxSelector).append('line').attr('class', 'explodingBoxplot line max vline'); // max vline
}
