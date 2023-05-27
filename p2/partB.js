// partB.js: p2 partB: make your own visualization of Nightingale data
// Copyright (C)  2023 University of Chicago. All rights reserved.
/*
This is only for students and instructors in the 2023 CMSC 23900 ("DataVis") class, for use in that
class. It is not licensed for open-source or any other kind of re-distribution. Do not allow this
file to be copied or downloaded by anyone outside the 2023 DataVis class.
*/
'use strict';
import {
  // what else do you want to import from common.js?
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (partB imports)
  fnColor, monthsData, 
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (1L in ref)
  d3,
} from './common.js';

// new things you might want to use for partB()
// v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (partB new)
// ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (0L in ref)

export const partB = (id, csvData) => {
  const svg = d3.select(`#${id}`);
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (partB code)
  const rgb = [
    fnColor.blue, 
    fnColor.pink, 
    fnColor.gray,
    fnColor.bkgd
  ];
  const data = monthsData(csvData);
  const marg = 50;
  const width = parseFloat(svg.style('width')) - 100;
  const height = parseFloat(svg.style('height')) - 200;
  const maxVal = d3.max(data.map((d) => Math.max(d.zRate, d.wRate, d.oRate)));
  const months = data.map((d) => `${d.month} ${d.year}`);

  const legendText = [ //legend
    [
      'The y-axis represents the percent of the army had the given',
      'cause of death for the month.',
    ],
    [
      'The colors of bars map to the following causes of death:',
      'Blue bars: Preventable disease',
      'Red bars: Wounds',
      'Grey bars: Other',
    ],
    [
      'November 1854, January 1855, and March 1855 have important',
      'events and have their highest bar labeled.',
    ],
  ];
  
  //title
  svg.append('text')
    .attr('x', 550)
    .attr('y', 40)
    .attr('text-anchor','middle')
    .attr('font-size',26)
    .text('Death rate of the British Army in the Crimean War');
  svg.append('text')
    .attr('x', 550)
    .attr('y', 75)
    .attr('text-anchor','middle')
    .attr('font-size',22)
    .text('Categorized by Cause of Death');

  //captions for important events
  svg.append('text')
    .attr('x', 345)
    .attr('y', 410)
    .attr('transform','translate(170, -90), rotate(20)')
    .attr('text-anchor','end')
    .attr('font-size',14)
    .text('Nightingale arrives in Crimea'); //nov 1854
  svg.append('text')
    .attr('x', 450)
    .attr('y', 150)
    .attr('transform','translate(60, -150), rotate(20)')
    .attr('text-anchor','start')
    .attr('font-size',14)
    .text('Fighting reaches its climax'); //jan 1855
  svg.append('text')
    .attr('x', 550)
    .attr('y', 410)
    .attr('transform','translate(140, -220), rotate(20)')
    .attr('text-anchor','start')
    .attr('font-size',14)
    .text('Sanitary commission arrives'); //mar 1855
  
  const xScale = d3 //x scale
    .scaleBand()
    .domain(months)
    .range([0, width]);

  const yScale = d3 //y scale
    .scaleLinear()
    .domain([0, maxVal])
    .range([0, height]);

  const hScale = d3
    .scaleLinear()
    .domain([0, maxVal])
    .range([- height - 75, 10]);
  /* ok honestly we messed up with making the outer thing which screwed up
    our y-values everywhere and we didn't catch it until much later so we have
    very weird things like 2 y-scales! so if there's weird coding choices like
    that then you know why*/

    const outer = svg  // create an "outer" svg 
        .append('g')
        .attr('transform', `translate(${marg},${height+150})`) //transform the axis into a pretty good place: height is currently 600, width is 1100
    outer //x-axis
        .append('g')
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "start")
        .style("font-size", 7)
        .style("fill", "#000000")
        .attr('transform', 'translate(0, 5),rotate(20)'); //make the text not overlap by rotating

    outer //y-axis
        .append('g')
        .call(d3.axisLeft(hScale))
        .selectAll("text")
        .text('')
        .attr("text-anchor", "end")
        .style("font-size", 5)
        .style("fill", "#000000");

    for(let i = 0; i <= 10; i++) { //hard coding labels on y-axis
      outer.append('text')
          .text(`${i}%`)
          .attr('x', -20)
          .attr('y', - 47.2 * i)
          .attr('font-size', 9)
    }

    ['zRate', 'wRate', 'oRate',].map((rate,idx)=>{ //creating 3 bars for each month
      outer
        .selectAll(['.zbar','.wbar','.obar'][idx])
        .data(data)
        .join('line')
        .attr('class',['zbar','wbar','obar'][idx])
        .attr('stroke', rgb[idx])
        .attr('stroke-width',10)
        .attr('x1', (d,i) => xScale(months[i]) + 10 * (idx+1)) //using 10 * (idx+1) gives us 3 bars 
        .attr('x2', (d,i) => xScale(months[i]) + 10 * (idx+1)) //  map through the array
        .attr('y1', 0)
        .attr('y2', (d) => -yScale([d.zRate, d.wRate, d.oRate][idx]));
      });

      //LEGEND
      let acc = 200;
      legendText.forEach((element) => {
        for(let i = 0; i < element.length; i++) {
        svg
          .append('text')
          .attr('transform', `translate(${670 + (!!i)*15},${acc += 17})`) //the !!i lets us indent all lines besides the first
          .attr('text-anchor', 'start')
          .attr('font-size', 14)
          .text(`${element[i]}`);
        }
      });
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (70L in ref)
};
