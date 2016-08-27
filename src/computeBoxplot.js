import * as d3 from 'd3';
import { collectClassProportions } from './collectClassProportions';

export function computeBoxplot(data, options) {
  console.log('computeBoxplot() was called');
  console.log('data from computeBoxplot', data);
  console.log('iqrScalingFactor', iqrScalingFactor);
  console.log('value from computeBoxplot', value);
  let chartOptions = options.chartOptions;
  let iqrScalingFactor = chartOptions.display.iqr;
  let value = chartOptions.axes.y.variable;
  
  iqrScalingFactor = iqrScalingFactor || 1.5;
  value = value || Number;
  const seriev = data.map(m => m[value]).sort(d3.ascending);
  const quartiles = [
    d3.quantile(seriev, 0.25),
    d3.quantile(seriev, 0.5),
    d3.quantile(seriev, 0.75)
  ];
  const iqr = (quartiles[2] - quartiles[0]) * iqrScalingFactor;
  console.log('iqr', iqr);
  // separate outliers
  let max = Number.MIN_VALUE;
  let min = Number.MAX_VALUE;
  const boxData = d3.nest()
      .key(d => {
        const v = d[value];
        const type = (v < quartiles[0] - iqr || v > quartiles[2] + iqr) ? 'outlier' : 'normal';
        if (type === 'normal' && (v < min || v > max)) {
          max = Math.max(max, v);
          min = Math.min(min, v);
        }
        return type;
      })
      .object(data);
  if (!boxData.outlier) boxData.outlier = [];
  // calculate class proportions
  let currentClassProportions;
  if (chartOptions.categoricalVariables.length > 0) {
    const currentBoxNormalPointsData = boxData.normal;
    currentClassProportions = collectClassProportions(
      currentBoxNormalPointsData,
      { categoricalVariables: chartOptions.categoricalVariables }
    );
    console.log('currentClassProportions from computeBoxplot', currentClassProportions);  
  }
  boxData.quartiles = quartiles;
  boxData.iqr = iqr;
  boxData.max = max;
  boxData.min = min;
  boxData.classProportions = currentClassProportions;
  console.log('boxData', boxData);
  return boxData;
}
