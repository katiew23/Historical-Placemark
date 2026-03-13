import { assert } from "chai";

// helper file for the tests contains utility functions that make tests easier to write

export function assertSubset(subset, superset) {
  // if the small value is empty or null or undefined the big value must also be empty
  if (subset === null || subset === undefined) {
    return superset === null || superset === undefined;
  }
  
  // if its a simple value just compare it directly
  if (typeof subset !== "object") {
    return subset === superset;
  }
  
  // if one is an object and the other isnt they dont match
  if (typeof superset !== "object" || superset === null) {
    return false;
  }
  
  // Check that both values are dates and that they are the same date.
  if (subset instanceof Date) {
    return superset instanceof Date && subset.valueOf() === superset.valueOf();
  }
  
  // check that every item in the small array also exists somewhere in the bigger array
  if (Array.isArray(subset)) {
    if (!Array.isArray(superset)) {
      return false;
    }
    // for each element in subset, find a matching element in superset
    return subset.every((subsetItem) => superset.some((supersetItem) => assertSubset(subsetItem, supersetItem)));
  }
  
  // check that every field in the small object also exists in the big object
  return Object.keys(subset).every((key) => {
    // key must exist in superset
    if (!(key in superset)) {
      assert.fail(`Key ${key} not found in superset`);
      return false;
    }
    
    const subsetValue = subset[key];
    const supersetValue = superset[key];
    assert.equal(subsetValue, supersetValue);
    
    // checks if one object contains some of the values of another object
    return assertSubset(subsetValue, supersetValue);
  });
}