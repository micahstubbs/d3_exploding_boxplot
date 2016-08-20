import * as d3 from 'd3';

export function computeBoxplot(data, iqrScalingFactor, value) {
  console.log('computeBoxplot() was called');

  console.log('arguments from computeBoxplot: data, iqrScalingFactor, value',  arguments);
  iqrScalingFactor = iqrScalingFactor || 1.5;
  value = value || Number;
  const seriev = data.map(m => m[value]).sort(d3.ascending);
  const quartiles = [
    d3.quantile(seriev, 0.25),
    d3.quantile(seriev, 0.5),
    d3.quantile(seriev, 0.75)
  ];
  console.log('quartiles from computeBoxplot', quartiles);
  const iqr = (quartiles[2] - quartiles[0]) * iqrScalingFactor;
  console.log('iqr from computeBoxplot', iqr);
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
      .map(data);
  if (!boxData.outlier) boxData.outlier = [];
  boxData.quartiles = quartiles;
  boxData.iqr = iqr;
  boxData.max = max;
  boxData.min = min;
  return boxData;
}
