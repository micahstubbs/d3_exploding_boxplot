import * as d3 from 'd3';
import { collectClassProportions } from './collectClassProportions';

export function computeBoxplot(data, options) {
  console.log('computeBoxplot() was called');
  console.log('data from computeBoxplot', data);
  let chartOptions = options.chartOptions;
  let iqrScalingFactor = chartOptions.display.iqr;
  if (typeof iqrScalingFactor === 'undefined') {
    iqrScalingFactor = 1.5;
  }
  let value = chartOptions.axes.y.variable;
  const categoricalVariables = chartOptions.categoricalVariables || [];
  
  value = value || Number;
  // console.log('iqrScalingFactor', iqrScalingFactor);
  // console.log('value from computeBoxplot', value);

  const seriev = data.map(m => m[value]).sort(d3.ascending);
  const quartiles = [
    d3.quantile(seriev, 0.25),
    d3.quantile(seriev, 0.5),
    d3.quantile(seriev, 0.75)
  ];
  const sum = d3.sum(seriev);
  const absoluteSum = d3.sum(seriev.map(d => Math.abs(d)));

  // root mean squared value
  // general case of root mean squared error
  const rmsv = Math.sqrt(d3.sum(seriev.map(d => Math.pow(d, 2))) / seriev.length);

  console.log('seriev', seriev);
  console.log('quartiles', quartiles);
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
  if (categoricalVariables.length > 0) {
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
  boxData.sum = sum;
  boxData.absoluteSum = absoluteSum;
  boxData.rootMeanSquaredValue = rmsv;
  boxData.classProportions = currentClassProportions;
  boxData.all = data;
  console.log('boxData', boxData);
  return boxData;
}
