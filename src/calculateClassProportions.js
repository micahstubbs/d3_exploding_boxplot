import * as d3 from 'd3';

export function calculateClassProportions(data, options) {
  // console.log('calculateClassProportions was called');
  const categoricalVariable = options.categoricalVariable;

  // get a array of unique classes (values) for 
  // the specified categoricalVariable
  // console.log('current categoricalVariable from calculateClassProportions', categoricalVariable);
  const uniqueClasses = d3.set(data, d => d[categoricalVariable]).values();
  // console.log('uniqueClasses from calculateClassProportions', uniqueClasses);

  // for each unique class, count the number of 
  // times it occurs in data
  const counts = {};
  uniqueClasses.forEach(d => {
    const currentCount = data
      .filter(e => e[categoricalVariable] === d)
      .length;
    counts[d] = currentCount;
  })
  // console.log('counts from calculateClassProportions', counts);

  // for each unique class, calculate proportions
  // from the counts and the total count 
  // from of all classes in the data
  const proportions = {};
  uniqueClasses.forEach(d => {
    const currentProportion = counts[d] / data.length;
    // console.log('data.length', data.length);
    // console.log('currentProportion', currentProportion);
    proportions[d] = currentProportion;
  })

  return proportions;
}
