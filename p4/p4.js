// p4.js: one possible place for p4 student code
// Copyright (C)  2023 University of Chicago. All rights reserved.
/*
This is only for students and instructors in the 2023 CMSC 23900 ("DataVis") class, for use in that
class. It is not licensed for open-source or any other kind of re-distribution. Do not allow this
file to be copied or downloaded by anyone outside the 2023 DataVis class.
*/
/*
NOTE: Document here (after the "begin  student  code" line)
v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (what other sources)
^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code
anyone or anything extra you used for this work.  Besides your instructor and TA (and project
partner, if you partnered with someone) who else did you work with?  What other code or web pages
helped you understand what to do and how to do it?  It is not a problem to seek more help to do
this work!  This is just to help the instructor know about other useful resources, and to help the
graders understand sources of code similarities.
*/
'use strict';
import {
  d3,
  parm,
  glob,
  // what else do you want to import from common.js?
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (common.js imports)
  warpA,
  warpC,
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code
} from './common.js';
import { rgb } from './d3.js';
// v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (p4 main)
/* NOTE: how this is set up is just off the top of GLK's head; it very likely does not represent
any kind of standard or best practice for how components in a web page should be made interactive
or manage/communicate their state ... */
import * as hex from './hexmap.js';
// the data pre-processor
const dataProc = () => {
  //confuser
  //categorizing the mortality rate to only red/blue
  //BEFORE BUTTON
  //LEFT
  glob.mortleft = glob.csvData.mortality.map((y) => ({ state: y['STATE'], color: 0 }));
  glob.mortleft.forEach((y, idx) => {
    if (parseInt(glob.csvData.mortality[idx]['RATE']) > 5.5) {
      y.color = 1; //red
    } else {
      y.color = 2; //blue
    }
  });
  glob.mortleft = glob.mortleft.filter((d, idx) => idx < 51);
  //RIGHT
  glob.mortright = glob.csvData.mortality.map((y) => ({ state: y['STATE'], mortality: 0 }));
  glob.mortright.forEach((y, idx) => {
    y.mortality = glob.csvData.mortality[idx]['RATE'];
  });
  glob.mortright = glob.mortright.filter((d, idx) => idx < 51); //ask Noah if I can put this together
  
  //AFTER BUTTON
  glob.mortbut = glob.csvData.mortality
    .map((y, idx) => ({ state: y['STATE'], mortality: y['RATE'] }))
    .filter((y, idx) => idx < 51);

  //changing the data to show the change
  glob.mortbut[4].mortality = '5.49'; 
  glob.mortbut[37].mortality = '5.49'; 
  glob.mortbut[39].mortality = '5.49'; 
  glob.mortbut[45].mortality = '5.49';
  glob.mortbut[0].mortality = '10.6'; 
  glob.mortbut[22].mortality = '9.6'; 
  glob.mortbut[21].mortality = '5.49'; 
  glob.mortbut[30].mortality = '5.49';
  glob.mortbut[32].mortality = '5.49';
  glob.mortbut[28].mortality = '5.49';
  glob.mortbut[29].mortality = '5.49';
  glob.mortbut[42].mortality = '8.2';
  glob.mortbut[33].mortality = '10';

  //LEFT - after the change
  glob.mortleftbut = glob.csvData.mortality.map((y) => ({ state: y['STATE'], color: 0 }));
  glob.mortleftbut = glob.mortleftbut.filter((d, idx) => idx < 51);
  glob.mortleftbut.forEach((y, idx) => {
    if (parseInt(glob.mortbut[idx]['mortality']) > 5.5) {
      y.color = 1; //red
    } else {
      y.color = 2; //blue
    }
  });

  //RIGHT - after the change
  glob.mortrightbut = glob.csvData.mortality.map((y) => ({ state: y['STATE'], mortality: 0 }));
  glob.mortrightbut = glob.mortrightbut.filter((d, idx) => idx < 51);
  glob.mortrightbut.forEach((y, idx) => {
    y.mortality = glob.mortbut[idx]['mortality'];
  });

  //hallucinator
  //diamond data (filtered it so that we have different variation in sizes and prices)
  glob.diadata = glob.csvData.diamonds
    .map((y) => ({ carat: y['carat'], color: y['color'], price: y['price'] }))
    .filter((d, index) => index % 10 == 0 && index < 1000 && d.price >= 2500);
  console.log(glob.diadata);
  glob.diadataFlip = [...glob.diadata].reverse();

  //jumbler - DEM vs REP
  //BEFORE BUTTON
  glob.state = {};
  glob.state = glob.csvData.stateNames.map((s) => ({
    stateAbbr: s,
  }));
  glob.state.forEach((s, idx) => { //calculating the political leaning
    s[`PL_2016`] =
      (2 * +glob.csvData.votes[idx][`RN_2016`]) /
        (1 + +glob.csvData.votes[idx][`RN_2016`] + +glob.csvData.votes[idx][`DN_2016`]) -
      1;
  });
};

//color for left side - either dark or light blue (confuser)
const cmapBleft = function (state) {
  if (state.color == 1) {
    return d3.rgb(33, 113, 181);
  } else {
    return d3.rgb(222, 236, 248);
  }
};

//color for right side map - six different colors for 6 different ranges (confuser)
const cmapBright = function (state) {
  let rate = parseFloat(state.mortality);
  let color = d3.rgb(255, 255, 255);
  if (rate < 4) {
    color = d3.rgb(222, 236, 248);
  } else if (rate < 5) {
    color = d3.rgb(198, 219, 239);
  } else if (rate < 5.5) {
    color = d3.rgb(158, 202, 225);
  } else if (rate < 6) {
    color = d3.rgb(107, 175, 214);
  } else if (rate < 7) {
    color = d3.rgb(65, 146, 198);
  } else {
    color = d3.rgb(33, 113, 181);
  }
  return color;
};

//purple scale for political leaning (for right map)
const purScale = function (PL) {
    let scale = d3
      .scaleLinear()
      .domain([-1, -0.5, -0.1, 0, 0.1, 0.5, 1])
      .range([
        parm.colorDem,
        parm.colorDem,
        d3.rgb(130, 40, 180),
        d3.rgb(130, 40, 180),
        d3.rgb(130, 40, 180),
        parm.colorRep,
        parm.colorRep,
      ]);
    return scale(PL);
  };

//rainbow color scale for political leaning (for left map)
const rainbowScale = function (PL) {
//helper function for coloring LVA for scatterplot/hexmap
let hue = d3.scaleLinear().domain([-1, 1]).range([0, 255]);
    return d3.hsl(hue(warpC(PL, 2)), 1, 0.5);
};

//returning rgb after political leaning value is adjusted using rainbow scale
const cmapCleft = function (state) {
    return rainbowScale(state[`PL_2016`]);
};
//returning rgb after political leaning value is adjusted using purple scale
const cmapCright = function (state) {
    return purScale(state['PL_2016']);
};

//AFTER BUTTON
//changing the value to show the world with dramatic data change (left map)
//rep vs dem is reversed
const cmapCleftFlip = function (state) {
let PL = state['PL_2016'];
if (PL <= -0.5 || PL >= 0.5) {
    return rainbowScale(PL);
} else {
    return rainbowScale(-PL);
}
};

//after there is a change in data with dramatic data change (right map)
//rep vs dem is reversed
const cmapCrightFlip = function (state) { 
let PL = state['PL_2016'];
if (PL <= -0.5 || PL >= 0.5) {
    return purScale(PL);
} else {
    return purScale(-PL);
}
};

  //adding color to diamond points (hallucinator)
//have high opacity (bad, viewer cannot see different colors)
const diaCmapBad = function (dia) {
  let color = d3.rgb(0, 0, 0);
  switch (dia.color) {
    case 'D':
      color = d3.rgb(255, 0, 0, 0.66);
      break;
    case 'E':
      color = d3.rgb(0, 255, 0, 0.66);
      break;
    case 'F':
      color = d3.rgb(0, 0, 255, 0.66);
      break;
    case 'G':
      color = d3.rgb(255, 255, 0, 0.66);
      break;
    case 'H':
      color = d3.rgb(255, 0, 255, 0.66);
      break;
    case 'I':
      color = d3.rgb(0, 255, 255, 0.66);
      break;
    case 'J':
      color = d3.rgb(200, 200, 200, 0.66);
      break;
  }
  return color;
};
//adding colors to diamond color
//low opacity, good, allows viewer to see differnt colors
//right side of the map
const diaCmapGood = function (dia) {
  let color = d3.rgb(0, 0, 0);
  switch (dia.color) {
    case 'D':
      color = d3.rgb(255, 0, 0, 0.2);
      break;
    case 'E':
      color = d3.rgb(0, 255, 0, 0.2);
      break;
    case 'F':
      color = d3.rgb(0, 0, 255, 0.2);
      break;
    case 'G':
      color = d3.rgb(255, 255, 0, 0.2);
      break;
    case 'H':
      color = d3.rgb(255, 0, 255, 0.2);
      break;
    case 'I':
      color = d3.rgb(0, 255, 255, 0.2);
      break;
    case 'J':
      color = d3.rgb(200, 200, 200, 0.2);
      break;
  }
  return color;
};
const outerW = Math.floor(0.48 * window.innerWidth),
  outerH = Math.floor(outerW * 0.618);

//x and y scale for diamond scatterplot
const xScale = d3
  .scaleLinear()
  .domain([0.5, 1.5])
  .range([0, outerW - 20]);
const yScale = d3
  .scaleLinear()
  .domain([2500, 3000])
  .range([outerH * 1.5, 0]);
const setupperScatA = (theDiv) => {
  console.log('setupperScatA: hello');
  // stt = return per-part state container (mis-spelled to lessen clash w/ US states
  const stt = {};
  // some of this code is modified from what was given in ilcm.js
  const outerW = Math.floor(0.48 * window.innerWidth),
    outerH = Math.floor(outerW * 0.618),
    marg = 10;
  ['visLeft', 'visRight'].map((vx) => {
    stt[vx] = theDiv
      .append('svg')
      .attr('id', vx + 'svgA')
      .attr('width', outerW)
      .attr('height', outerH)
      .append('g');
    d3.select('#visLeftsvgA')
      .selectAll('.diamond')
      .data(glob.diadata)
      .join('circle')
      .attr('class', 'diamond')
      .attr('cx', (d) => xScale(d.carat))
      .attr('cy', (d) => yScale(d.price))
      .style('fill', (d) => diaCmapBad(d))
      .attr('r', 6);
    d3.select('#visLeftsvgA')
      .append('g')
      .call(d3.axisBottom(xScale))
      .attr('transform', `translate(0,${outerH - 20})`);
    d3.select('#visLeftsvgA')
      .append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('text-anchor', 'start')
      .style('font-size', 7)
      .style('fill', '#000000')
      .attr('transform', 'translate(10,0)');
  });
  for (let i = 0; i < 5; i++) {
    d3.select('#visRightsvgA')
      .append('g')
      .attr('class', 'layer')
      .selectAll('.diamond')
      .data(glob.diadata)
      .join('circle')
      .attr('class', 'diamond')
      .attr('cx', (d) => xScale(d.carat))
      .attr('cy', (d) => yScale(d.price))
      .style('fill', (d) => diaCmapGood(d))
      .attr('r', 6);
  }
  d3.select('#visRightsvgA')
    .append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${outerH - 20})`);
  d3.select('#visRightsvgA')
    .append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .style('text-anchor', 'start')
    .style('font-size', 7)
    .style('fill', '#000000')
    .attr('transform', 'translate(10,0)');
  return stt;
};
// example of a setupper function
const setupperHexB = (theDiv) => {
  console.log('setupperHexB: hello');
  // stt = return per-part state container (mis-spelled to lessen clash w/ US states
  const stt = {};
  // some of this code is modified from what was given in ilcm.js
  const outerW = Math.floor(0.48 * window.innerWidth),
    outerH = Math.floor(outerW * 0.618),
    marg = 10;
  ['visLeft', 'visRight'].map((vx) => {
    stt[vx] = theDiv
      .append('svg')
      .attr('id', vx + 'svgB')
      .attr('width', outerW)
      .attr('height', outerH)
      .append('g')
      .attr('transform', `translate(${marg},${marg})`);
    stt[`${vx}hexB`] = hex.mapFill(
      `${vx}svgB`,
      glob.csvData.hexRC.map((d) =>
        hex.gen(parm.hexWidth, parm.hexScale, d.StateAbbr, +d.row, +d.col)
      )
    );
    d3.select('#visLeftsvgB')
      .selectAll('path.stateHex')
      .data(glob.mortleft)
      .attr('fill', (d) => cmapBleft(d));
    d3.select('#visRightsvgB')
      .selectAll('path.stateHex')
      .data(glob.mortright)
      .attr('fill', (d) => cmapBright(d));
  });
  return stt;
};
const setupperHexC = (theDiv) => {
  console.log('setupperHexC: hello');
  // stt = return per-part state container (mis-spelled to lessen clash w/ US states
  const stt = {};
  // some of this code is modified from what was given in ilcm.js
  const outerW = Math.floor(0.48 * window.innerWidth),
    outerH = Math.floor(outerW * 0.618),
    marg = 10;
  ['visLeft', 'visRight'].map((vx) => {
    stt[vx] = theDiv
      .append('svg')
      .attr('id', vx + 'svgC')
      .attr('width', outerW)
      .attr('height', outerH)
      .append('g')
      .attr('transform', `translate(${marg},${marg})`);
    stt[`${vx}hexC`] = hex.mapFill(
      `${vx}svgC`,
      glob.csvData.hexRC.map((d) =>
        hex.gen(parm.hexWidth, parm.hexScale, d.StateAbbr, +d.row, +d.col)
      )
    );
    d3.select('#visLeftsvgC')
      .selectAll('path.stateHex')
      .data(glob.state)
      .transition()
      .duration(parm.transDur)
      .attr('fill', (d) => cmapCleft(d));
    d3.select('#visRightsvgC')
      .selectAll('path.stateHex')
      .data(glob.state)
      .transition()
      .duration(parm.transDur)
      .attr('fill', (d) => cmapCright(d));
  });
  glob.hexCount++;
  return stt;
};
//function to change the scatterplot for diamond scatterplot (hallucinator)
const scatChangerA = (bb, stt) => {
  console.log(`changerDemo(${bb}): hello`);
  // change colors based on new button state bb
  if (bb) {
    console.log(glob.diadataFlip);
    // change is being applied
    d3.select(`#visLeftsvgA`)
      .selectAll('.diamond')
      .data(glob.diadataFlip)
      .attr('cx', (d) => xScale(d.carat))
      .attr('cy', (d) => yScale(d.price))
      .style('fill', (d) => diaCmapBad(d))
      .attr('r', 6);
    d3.select(`#visRightsvgA`).selectAll('.layer').selectAll('.diamond').remove();
    d3.select(`#visRightsvgA`).selectAll('.layer').remove();
    for (let i = 0; i < 5; i++) {
      d3.select(`#visRightsvgA`)
        .append('g')
        .attr('class', 'layer')
        .selectAll('.diamond')
        .data(glob.diadataFlip)
        .join('circle')
        .attr('cx', (d) => xScale(d.carat))
        .attr('cy', (d) => yScale(d.price))
        .style('fill', (d) => diaCmapGood(d))
        .attr('r', 6);
    }
  } else {
    console.log(glob.diadata);
    // change is being removed (back to how things work at initialization)
    d3.select('#visLeftsvgA')
      .selectAll('.diamond')
      .data(glob.diadata)
      .join('circle')
      .attr('class', 'diamond')
      .attr('cx', (d) => xScale(d.carat))
      .attr('cy', (d) => yScale(d.price))
      .style('fill', (d) => diaCmapBad(d))
      .attr('r', 6);
    d3.select(`#visRightsvgA`).selectAll('.layer').selectAll('.diamond').remove();
    d3.select(`#visRightsvgA`).selectAll('.layer').remove();
    for (let i = 0; i < 5; i++) {
      d3.select('#visRightsvgA')
        .append('g')
        .attr('class', 'layer')
        .selectAll('.diamond')
        .data(glob.diadata)
        .join('circle')
        .attr('class', 'diamond')
        .attr('cx', (d) => xScale(d.carat))
        .attr('cy', (d) => yScale(d.price))
        .style('fill', (d) => diaCmapGood(d))
        .attr('r', 6);
    }
  }
  // apply change
};
// example of a changer function
const hexChangerB = (bb, stt) => {
  console.log(`changerDemo(${bb}): hello`);
  // change colors based on new button state bb
  if (bb) {
    // change is being applied
    d3.select(`#visLeftsvgB`)
      .selectAll('.stateHex')
      .data(glob.mortleftbut)
      .transition(parm.transDur)
      .attr('fill', (d) => cmapBleft(d));
    d3.select(`#visRightsvgB`)
      .selectAll('.stateHex')
      .data(glob.mortrightbut)
      .transition(parm.transDur)
      .attr('fill', (d) => cmapBright(d));
  } else {
    // change is being removed (back to how things work at initialization)
    d3.select(`#visLeftsvgB`)
      .selectAll('.stateHex')
      .data(glob.mortleft)
      .transition(parm.transDur)
      .attr('fill', (d) => cmapBleft(d));
    d3.select(`#visRightsvgB`)
      .selectAll('.stateHex')
      .data(glob.mortright)
      .transition(parm.transDur)
      .attr('fill', (d) => cmapBright(d));
  }
  // apply change
};
const hexChangerC = (bb, stt) => {
  console.log(`changerDemo(${bb}): hello`);
  // change colors based on new button state bb
  if (bb) {
    // change is being applied
    d3.select(`#visLeftsvgC`)
      .selectAll('.stateHex')
      .data(glob.state)
      .transition(parm.transDur)
      .attr('fill', (d) => cmapCleftFlip(d));
    d3.select(`#visRightsvgC`)
      .selectAll('.stateHex')
      .data(glob.state)
      .transition(parm.transDur)
      .attr('fill', (d) => cmapCrightFlip(d));
  } else {
    // change is being removed (back to how things work at initialization)
    d3.select(`#visLeftsvgC`)
      .selectAll('.stateHex')
      .data(glob.state)
      .transition(parm.transDur)
      .attr('fill', (d) => cmapCleft(d));
    d3.select(`#visRightsvgC`)
      .selectAll('.stateHex')
      .data(glob.state)
      .transition(parm.transDur)
      .attr('fill', (d) => cmapCright(d));
  }
};
/* maps from single letter to functions for initializing per-part visualizations. The setupper
function is passed the (d3.select of) the "div" in which VisLeft and VisRight go */
const setupper = {
  A: setupperScatA,
  B: setupperHexB,
  C: setupperHexC,
};
// maps from single letter to functions for apply/remove change in that part
const changer = {
  A: scatChangerA,
  B: hexChangerB,
  C: hexChangerC,
};
// text to have within button, depending on stt
const buttonText = (bb) => (!bb ? 'Apply Change' : 'Remove Change');
// populated by setupPart to map from single letter (e.g. 'A') to boolean
const buttonApplied = {};
// populated by setupPart to map from single letter (e.g. 'A') to d3 selection of button
const buttonItself = {};
// populated by setupPart to map from single letter to object to pass to changer
const partState = {};
/* wrapper around functions to apply change in parts, A, B, C;
   the passed "stt" is return from the setupper function */
export const buttonGo = (LL, stt) => {
  const bb = !buttonApplied[LL]; // intended new state of part (whether change is applied)
  // do the work of applying/removing change (if changer function is set)
  changer[LL] && changer[LL](bb, stt);
  buttonItself[LL].html(buttonText(bb)); // update button: change text ...
  buttonApplied[LL] = bb; // .. and remember new state
};
// sets up button and SVG for one the parts (LL == 'A', 'B', or 'C')
const setupPart = (LL) => {
  const div = d3.select(`#part${LL}`);
  /* code here similar in effect to this static html
   <div class="buttondiv">
    <button type="button" id="partAgo">Apply change</button>
   </div>
  */
  buttonApplied[LL] = false;
  const btn = div
    .append('div') // div to contain button
    .attr('class', 'buttondiv') // set its class
    .append('button') // add button inside div
    .attr('type', 'button') // set button type
    .attr('id', `part${LL}go`) // set button id
    .html(buttonText(buttonApplied[LL])); // set button text
  // remember the button
  buttonItself[LL] = btn;
  /* set the callback function for the button. Note the use of "() =>" to pass a way to call
  buttonGo(LL), rather than just calling buttonGo(LL) once immediately (as would happen without the
  "() =>"). The partState[LL] argument is set later in this function. */
  btn.on('click', () => buttonGo(LL, partState[LL]));
  // call setupper[LL] if set
  if (setupper[LL]) {
    partState[LL] = setupper[LL](div);
  }
};
// calls setupPart for each of the parts
export const setup = () => {
  dataProc();
  ['A', 'B', 'C'].map((L) => setupPart(L));
};
// ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code