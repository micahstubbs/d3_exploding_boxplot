import { calculateClassProportions } from './calculateClassProportions';

export function collectClassProportions(data, options) {
  // console.log('collectClassProportions was called');
  const categoricalVariables = options.categoricalVariables;
  const classProportionsByVariable = {};
  categoricalVariables.forEach(key => {
    classProportionsByVariable[key] = calculateClassProportions(data, { categoricalVariable: key });
  })
  return classProportionsByVariable;
}
