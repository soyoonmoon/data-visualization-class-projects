// common.js: things possibly useful across p4
// Copyright (C)  2023 University of Chicago. All rights reserved.
/*
This is only for students and instructors in the 2023 CMSC 23900 ("DataVis") class, for use in that
class. It is not licensed for open-source or any other kind of re-distribution. Do not allow this
file to be copied or downloaded by anyone outside the 2023 DataVis class.
*/
'use strict';

// import and then export d3
import * as d3 from './d3.js';
export { d3 };

// parameters that control geometry and appearance
export const parm = {
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (parm)
  transDur: 400, // transition duration (transitions not required for p4!)
  hexWidth: 52,
  hexScale: 1,
  margin: 50,
  colorDem: d3.rgb(40, 50, 255),
  colorRep: d3.rgb(230, 30, 20),
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code
};

/* global bag of state; could be called "state" but that could be confusing with a US "state". The
  description "global bag of state" is a hint that this is not the cleanest design :) */
export const glob = {
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (glob)
  csvData: {}, // will be populated by top-level script in index.html
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code
};

// little utility functions, use or not as you see fit
export const lerp3 = function (a, b, w) {
  return (1 - w) * a + w * b;
};
export const lerp5 = function (y0, y1, x0, x, x1) {
  const w = (x - x0) / (x1 - x0);
  return (1 - w) * y0 + w * y1;
};
export const clamp = function (a, v, b) {
  return v < a ? a : v > b ? b : v;
};
export const warpA = (x, p) => Math.pow(x, 1 / p);

export const warpC = (x, p) => (x > 0 ? warpA(x, p) : -warpA(-x, p));

// define, and export, anything else here that you want to use in p4
// v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (more common)

// ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code
