import * as d3 from 'd3';

export function createBoxplot(selector, data, options) {
  // console.log('createBoxplot() was called');

  const i = options.i;
  const g = data;
  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;
  const chartWrapper = options.chartWrapper;
  const groups = options.groups;
  // console.log('selector from createBoxplot', selector);
  // console.log('chartWrapper.select(selector)', chartWrapper.select(selector));
  // console.log('chartOptions from createBoxplot', chartOptions);

  // console.log('this from createBoxplot', this);
  const s = chartWrapper.select(selector).append('g')
    .attr('class', 'explodingBoxplot box')
    .attr('id', `explodingBoxplot_box${chartOptions.id}${i}`);
    // .selectAll('.box')
    // .data([g])
    // .enter();

  const createBoxplotSelection = s.selectAll('.box')
    .data([g]);

  // 
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
  
  // median line
  chartWrapper.select(currentBoxplotBoxSelector)
    .append('line')
    .attr('class', 'explodingBoxplot median line');

  // min line
  chartWrapper.select(currentBoxplotBoxSelector)
    .append('line')
    .attr('class', 'explodingBoxplot min line hline');

  // min vline
  chartWrapper.select(currentBoxplotBoxSelector)
    .append('line')
    .attr('class', 'explodingBoxplot line min vline');

  // max line
  chartWrapper.select(currentBoxplotBoxSelector)
    .append('line')
    .attr('class', 'explodingBoxplot max line hline');

  // max vline
  chartWrapper.select(currentBoxplotBoxSelector)
    .append('line')
    .attr('class', 'explodingBoxplot line max vline');
}
