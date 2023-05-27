// partA.js: p2 partA: recreation of Nightingale plot
// Copyright (C)  2023 University of Chicago. All rights reserved.
/*
This is only for students and instructors in the 2023 CMSC 23900 ("DataVis") class, for use in that
class. It is not licensed for open-source or any other kind of re-distribution. Do not allow this
file to be copied or downloaded by anyone outside the 2023 DataVis class.
*/
'use strict';
import {
  captionText, capsMonth,
  // what do you want to import from common.js?
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (partA imports)
  fnColor, monthsData, 
  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (1L in ref)
  d3,
} from './common.js';

// new things you might want to use for partA()
// v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (partA new)
// ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (20L in ref)

// how you make part A
export const partA = (id, csvData) => {
  const svg = d3.select(`#${id}`);
  // v.v.v.v.v.v.v.v.v.v.v.v.v.v.v  begin student code (partA code)
  const data = monthsData(csvData);
  const maxRate = data.map((d) => ({ month: d.month, rate: Math.max(d.oRate, d.wRate, d.zRate, 80)}));
  console.log(maxRate);

  const rgb = [ //rgb needed for the second graph (1855 to 1856)
      fnColor.blue, 
      fnColor.gray,
      fnColor.pink, 
      fnColor.bkgd
      ];
  const rgb1 = [ //rgb needed for the first graph (1854 to 1855)
        fnColor.blue, 
        fnColor.pink, 
        fnColor.gray,
        fnColor.bkgd
    ];
  const border = [ //border needed for the second graph (1855 to 1856)
      d3.rgb(69,112,229),
      d3.rgb(16,16,16),
      d3.rgb(200,106,87)
  ];
  const border1 = [ //border needed for the first graph (1854 to 1855)
    d3.rgb(69,112,229),
    d3.rgb(200,106,87),
    d3.rgb(16,16,16)
];

  const months1 = [ //months needed for first graph (1854 to 1855)
    'APRIL 1854', 
    'MAY', 
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
    'JANUARY 1855',
    'FEBRUARY', 
    'MARCH 1855',
  ];
  const months2 = [ //months needed for first graph (1855 to 1856)
    'APRIL 1855', 
    'MAY', 
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
    'JANUARY',
    'FEBRUARY', 
    'MARCH 1856',
  ];
  
  //background
  svg.append('rect')
     .attr('height', '600')
     .attr('width', '1100')
     .attr('fill', `${rgb[3]}`);
  //title and top labels
  svg.append('text')
     .attr('x', '200') //x and y location of the number for the title. 
     .attr('y', '45')
     .attr('text-anchor','middle')
     .attr('font-size', '14')
     .text('2.');//Number for the title of the graph showing data from 1855 to 1856
  svg.append('text')
     .attr('x', '200') //x and y location of the title.
     .attr('y', '60')
     .attr('text-anchor','middle')
     .attr('font-size', '16')
     .text('APRIL 1855 to MARCH 1856');//title of the graph showing data from 1855 to 1856

  svg.append('text')
     .attr('x', '850') //x and y location of the number for the title
     .attr('y', '45')
     .attr('text-anchor','middle')
     .attr('font-size', '14')
     .text('1.');//Number for the title of the graph showing data from 1854 to 1855
  svg.append('text')
     .attr('x', '850')//x and y location of the title.
     .attr('y', '60')
     .attr('text-anchor','middle')
     .attr('font-size', '16')
     .text('APRIL 1854 to MARCH 1855');//Title of the graph showing data from 1854 to 1855
  
  svg.append('text')
     .attr('x', '550')//x and y location of the second line of the big title.
     .attr('y', '60')
     .attr('text-anchor','middle')
     .attr('font-size', '18')
     .text('in the ARMY in the EAST');//Title of the whole graph
  svg.append('text')
     .attr('x', '550')//x and y location of the first line of the big title.
     .attr('y', '35')
     .attr('text-anchor','middle')
     .attr('font-size', '22')
     .text('DIAGRAM of the CAUSES of MORTALITY');//Title of the whole graph

  //right circle (1854-1855)
  let g = svg
      .append('g')
      .attr('transform', 'translate(850,250)');
  
  //arc helper function
  const arcgen = (d, i, category) =>
  d3
    .arc()
    .innerRadius(0)
    .outerRadius((Math.sqrt(d[category]))*10)
    .startAngle(Math.PI / 6 * (i) - Math.PI/2) //Starting angle for the graph, which is 180 degrees in the polar coordinate system
    .endAngle(Math.PI / 6 * (i+1) - Math.PI/2)(); // Ending angle for the graph (1/12 of the circle)

  //drawing the arcs
  ['zRate','oRate','wRate'].map((rate,idx)=>{
    g.append('g')
      .selectAll('.sectors')
      .data(data.slice(0,12)) //data for April 1854 - March 1855
      .join('path')
      .attr('class', 'sectors')
      .attr('d', (d, i) => arcgen(d, i, rate))
      .attr('fill', rgb[idx])
      .style('stroke', border[idx]);
  });
  
  //calculating position for month labels on the arcs
  function textgen1 (i) {
    let r = Math.sqrt(maxRate[i].rate)*10 + 20;
    const angle = Math.PI / 6 * (6 + i) + Math.PI / 12;
    // Use the arc generator to create a path for the character
    const x = Math.cos(angle) * r; //calculating the x and y coordinate of the months texts around the graph
    const y = Math.sin(angle) * r;
    return `translate(${x},${y})`;
  }

  //adding month labels to arcs
  months1.forEach((month, idx) => {
    g.append('text')
      .attr('transform', textgen1(idx)) //transforming the month labels using the x and y coordinates calculated from textgen1.
      .attr('text-anchor', 'middle')
      .attr('font-size', 9.5)
      .text(`${month}`);
  });
  
  //Circle on the left (1855-1856)
  let g2 = svg
      .append('g')
      .attr('transform', 'translate(200,250)');

  //arc helper function
  const arcgen2 = (d, i, category) =>
  d3
    .arc()
    .innerRadius(0)
    .outerRadius((Math.sqrt(d[category]))*10)
    .startAngle(Math.PI / 6 * (i) - Math.PI / 2) //Starting angle for the graph, which is 180 degrees in the polar coordinate system
    .endAngle(Math.PI / 6 * (i+1) - Math.PI / 2)(); // Ending angle for the graph (1/12 of the circle)

  //drawing the arcs
  ['zRate','wRate','oRate'].map((rate,idx)=>{
      g2.append('g')
      .selectAll('.sectors')
      .data(data.slice(12,24)) //data for April 1855 - March 1856
      .join('path')
      .attr('class', 'sectors')
      .attr('d', (d, i) => arcgen2(d, i, rate))
      .attr('fill', rgb1[idx])
      .style('stroke', border1[idx]);
  });
  
  //calculating position for month labels on the arcs
  function textgen2 (i) {
    let r = Math.sqrt(maxRate[i].rate)*10 + 10;
    const angle = Math.PI / 6 * (6 + i) + Math.PI / 12;
    // Use the arc generator to create a path for the character
    const x = Math.cos(angle) * r;//calculating the x and y coordinate of the months texts around the graph
    const y = Math.sin(angle) * r;
    return `translate(${x},${y})`;
  }
  //adding month labels to arcs
  months2.forEach((month, idx) => {
    g2.append('text')
    .attr('transform', textgen2(idx+12))
    .attr('text-anchor', 'middle')
    .attr('font-size', 9.5)
    .text(`${month}`);
  });

  //hardcoding january 1856 caption so it doesn't overlap with december
  g2.append('text')
    .attr('transform', 'translate(-25.74,105)')
    .attr('text-anchor', 'middle')
    .attr('font-size', 9.5)
    .text('1856');

  //bottom left caption
  let acc = 380;
  captionText.forEach((element) => {
    for(let i = 0; i < element.length; i++) {
    svg
      .append('text')
      .attr('transform', `translate(${50 + (!!i)*15},${acc += 17})`)
      .attr('text-anchor', 'start')
      .attr('font-size', 14)
      .text(`${element[i]}`);
    }
  });

  // ^'^'^'^'^'^'^'^'^'^'^'^'^'^'^  end student code (136L in ref)
};
