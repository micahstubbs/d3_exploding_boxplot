export function keyWalk(valuesObject, optionsObject) {
  console.log('keyWalk() was called');
  if (!valuesObject || !optionsObject) return;
  const vKeys = Object.keys(valuesObject);
  const oKeys = Object.keys(optionsObject);
  for (let k = 0; k < vKeys.length; k++) {
    if (oKeys.indexOf(vKeys[k]) >= 0) {
      const oo = optionsObject[vKeys[k]];
      const vo = valuesObject[vKeys[k]];
      if (typeof oo === 'object' && typeof vo !== 'function') {
        keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
      } else {
        optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
      }
    }
  }
}
