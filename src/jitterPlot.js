import { initJitter } from './initJitter';
import { drawJitter } from './drawJitter';
import * as d3 from 'd3';

export function jitterPlot(i, options) {
  console.log('jitterPlot() was called');

  const chartOptions = options.chartOptions;
  const colorScale = options.colorScale;
  const xScale = options.xScale;
  const yScale = options.yScale;
  const groups = options.groups;
  const events = options.events;
  const constituents = options.constituents;
  const transitionTime = options.transitionTime;
  const chartWrapper = options.chartWrapper;
  const boxExploded = options.boxExploded;

  let boxWidth;
  if (typeof chartOptions.display.maxBoxWidth !== 'undefined') {
    boxWidth = chartOptions.display.maxBoxWidth;
  } else {
    boxWidth = xScale.bandwidth();
  }

  // check for an `exploded` class on our boxcontent g element
  // console.log('chartWrapper from jitterPlot', chartWrapper);
  // console.log('i from jitterPlot', i);
  // const boxcontentG = chartWrapper.select(`#explodingBoxplot${chartOptions.id}${i}`);
  // console.log('boxcontentG from jitterPlot', boxcontentG);

  // console.log("boxcontentG['_groups'][0][0]", boxcontentG['_groups'][0][0]);
  // if (typeof boxcontentG['_groups'][0][0] !== 'undefined') {
  //   const boxcontentGClasses = boxcontentG.property('classList');
  //   // console.log('boxcontentGClasses from jitterPlot', boxcontentGClasses);
  //   const keys = Object.keys(boxcontentGClasses);
  //   // console.log('classList object keys from jitterPlot', keys);
  //   const values = keys.map(d => boxcontentGClasses[d]);
  //   // console.log('classList object values from jitterPlot', values);
  //   if(values.indexOf('exploded') !== -1) {
  //     boxExploded = true;
  //   }
  // }

  const elem = chartWrapper.select(`#explodingBoxplot${chartOptions.id}${i}`)
    .select('.outliers-points');

  const displayOutliers = elem.selectAll('.point')
    .data(groups[i].outlier);

  displayOutliers.exit()
    .remove();

  const drawJitterOptions = {
    chartOptions,
    colorScale,
    xScale,
    yScale
  };

  const initJitterOptions = {
    chartOptions,
    colorScale,
    events,
    constituents
  };

  displayOutliers
    .enter()
    .append('circle')
    .merge(displayOutliers)
      .attr('cx', boxWidth * 0.5)
      .attr('cy', yScale(groups[i].quartiles[1]))
      .call(initJitter, initJitterOptions)
      .transition()
      .ease(d3.easeBackOut)
      .delay(() => (transitionTime * 1.5) + (100 * Math.random()))
      .duration(() => (transitionTime * 1.5) + ((transitionTime * 1.5) * Math.random()))
      .call(drawJitter, drawJitterOptions);

  // append normal points here as well so that they can be
  // styled before being shown
  const displayNormalPoints = chartWrapper.select(`#explodingBoxplot${chartOptions.id}${i}`)
    .select('.normal-points')
    .selectAll('.point')
    .data(groups[i].normal);
    console.log('groups[i].normal from jitterPlot', groups[i].normal);

  displayNormalPoints.exit()
    .remove();

  displayNormalPoints
    .enter()
    .append('circle')
    .merge(displayNormalPoints)
      .attr('visibility', () => {
        if (typeof boxExploded !== 'undefined') {
          return 'visible'
        } else {
          return 'hidden'
        }
      })
      .attr('cx', boxWidth * 0.5)
      .attr('cy', yScale(groups[i].quartiles[1]))
      .call(initJitter, initJitterOptions)
      .call(drawJitter, drawJitterOptions);
}

