/*
eslint
no-undef: "off",
func-names: "off",
no-use-before-define: "off",
no-console: "off",
no-unused-vars: "off"
*/
import { implodeBoxplot } from './implodeBoxplot';
import { drawBoxplot } from './drawBoxplot';
import { createJitter } from './createJitter';
import { drawJitter } from './drawJitter';
import { createBoxplot } from './createBoxplot';
import { keyWalk } from './keyWalk';
import { computeBoxplot } from './computeBoxplot';
import { initJitter } from './initJitter';
import { jitterPlot } from './jitterPlot';
import { explodeBoxplot } from './explodeBoxplot';
import * as d3 from 'd3';
export default function () {
  // options which should be accessible via ACCESSORS
  let dataSet = [];
  const privateDataSet = [];

  let groups;

  // create state object for shared state
  // TODO: find a better pattern
  const state = {};
  state.explodedBoxplots = [];

  const options = {
    id: '',
    class: 'xBoxPlot',
    width: window.innerWidth,
    height: window.innerHeight,
    margin: {
      top: 10,
      right: 10,
      bottom: 30,
      left: 40
    },
    axes: {
      x: {
        label: '',
        ticks: 10,
        scale: 'linear',
        nice: true,
        tickFormat: undefined,
        domain: undefined
      },
      y: {
        label: '',
        ticks: 10,
        scale: 'linear',
        nice: true,
        tickFormat(n) { return n.toLocaleString(); },
        domain: undefined
      }
    },
    data: {
      colorIndex: 'color',
      label: 'undefined',
      group: undefined,
      identifier: undefined
    },
    datapoints: {
      radius: 3
    },
    display: {
      iqr: 1.5, // interquartile range
      boxpadding: 0.2
    },
    resize: true,
    mobileScreenMax: 500
  };

  const constituents = {
    elements: {
      domParent: undefined,
      chartRoot: undefined
    },
    scales: {
      X: undefined,
      Y: undefined,
      color: undefined
    }
  };

  let windowWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

  let mobileScreen = (windowWidth < options.mobileScreenMax);

  const defaultColors = {
    0: '#a6cee3',
    1: '#ff7f00',
    2: '#b2df8a',
    3: '#1f78b4',
    4: '#fdbf6f',
    5: '#33a02c',
    6: '#cab2d6',
    7: '#6a3d9a',
    8: '#fb9a99',
    9: '#e31a1c',
    10: '#ffff99',
    11: '#b15928'
  };
  let colors = JSON.parse(JSON.stringify(defaultColors));

  let update;

  // programmatic
  let transitionTime = 200;

  // DEFINABLE EVENTS
  // Define with ACCESSOR function chart.events()
  const events = {
    point: {
      click: null,
      mouseover: null,
      mouseout: null
    },
    update: {
      begin: null,
      ready: null,
      end: null
    }
  };

  function chart(selection) {
    console.log('chart() was called');
    // console.log('selection from chart()', selection);
    selection.each(function () {
      const domParent = d3.select(this);
      // console.log('domParent', domParent);
      constituents.elements.domParent = domParent;

      const chartRoot = domParent.append('svg')
        .attr('class', 'svg-class');
      constituents.elements.chartRoot = chartRoot;

      // background click area added first
      const resetArea = chartRoot.append('g')
        .append('rect')
          .attr('id', 'resetArea')
          .attr('width', options.width)
          .attr('height', options.height)
          .style('color', 'white')
          .style('opacity', 0);

      // main chart area
      const chartWrapper = chartRoot.append('g')
        .attr('class', 'chartWrapper')
        .attr('id', `chartWrapper${options.id}`);

      windowWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

      mobileScreen = (windowWidth < options.mobileScreenMax);

      // boolean resize used to disable transitions during resize operation
      update = resize => {
        // console.log('update/resize function was called');
        chartRoot
          .attr('width', (options.width + options.margin.left + options.margin.right))
          .attr('height', (options.height + options.margin.top + options.margin.bottom));

        chartWrapper
          .attr('transform', `translate(${options.margin.left},${options.margin.top})`);

        // console.log('events.update.begin', events.update.begin);
        if (events.update.begin) { events.update.begin(constituents, options, events); }

        // console.log('options.data.group', options.data.group);
        if (options.data.group) {
          groups = d3.nest()
            .key(k => k[options.data.group])
            .entries(dataSet);
        } else {
          groups = [{
            key: '',
            values: dataSet
          }];
        }
        // console.log('groups after nest', groups);

        const xScale = d3.scaleBand()
          .domain(groups.map(d => d.key)) 
          .padding(options.display.boxpadding)
          .rangeRound(
            [0, options.width - options.margin.left - options.margin.right]
          );

        constituents.scales.X = xScale;
        // console.log('xScale.domain()', xScale.domain());
        // console.log('xScale.range()', xScale.range());

        // create boxplot data
        groups = groups.map(g => {
          console.log('options from inside of groups map', options);
          const o = computeBoxplot(g.values, options.display.iqr, options.axes.y.label);
          o.group = g.key;
          return o;
        });
        // console.log('groups after map', groups);

        const yScale = d3.scaleLinear()
          .domain(d3.extent(dataSet.map(m => m[options.axes.y.label])))
          .range([options.height - options.margin.top - options.margin.bottom, 0])
          .nice();

        constituents.scales.Y = yScale;
        // console.log('yScale.domain()', yScale.domain());
        // console.log('yScale.range()', yScale.range());

        const colorScale = d3.scaleOrdinal()
          .domain(d3.set(dataSet.map(m => m[options.data.colorIndex])).values())
          .range(Object.keys(colors).map(m => colors[m]));
        // console.log('colorScale.domain()', colorScale.domain());
        // console.log('colorScale.range()', colorScale.range());

        constituents.scales.color = colorScale;

        console.log('events.update.ready', events.update.ready);
        if (events.update.ready) { events.update.ready(constituents, options, events); }

        const xAxis = d3.axisBottom()
          .scale(xScale);
        // console.log('xAxis', xAxis);

        const yAxis = d3.axisLeft()
          .scale(yScale)
          .tickFormat(options.axes.y.tickFormat);
        // console.log('yAxis', yAxis);

        const implodeBoxplotOptions = {
          xScale,
          yScale,
          transitionTime,
          colorScale,
          chartOptions: options,
          groups,
          events,
          constituents
        };

        resetArea
          .on('dblclick', () => {
            implodeBoxplot(chartWrapper, implodeBoxplotOptions, state);
          });

        const updateXAxis = chartWrapper.selectAll('#xpb_xAxis')
          .data([0]);

        updateXAxis.exit()
          .remove();

        updateXAxis
          .enter()
          .append('g')
          .merge(updateXAxis)
            .attr('class', 'explodingBoxplot x axis')
            .attr('id', 'xpb_xAxis')
            .attr('transform',
              `translate(0,${options.height - options.margin.top - options.margin.bottom})`)
            .call(xAxis);

        chartWrapper.selectAll('g.x.axis')
          .append('text')
            .attr('class', 'axis text')
            .attr('x', (options.width - options.margin.left - options.margin.right) / 2)
            .attr('dy', '.71em')
            .attr('y', options.margin.bottom - 10)
            .style('font', '10px sans-serif')
            .style('text-anchor', 'middle')
            .style('fill', 'black')
            .text(options.axes.x.label);

        const updateYAxis = chartWrapper.selectAll('#xpb_yAxis')
          .data([0]);

        updateYAxis.exit()
          .remove();

        updateYAxis
          .enter()
          .append('g')
          .merge(updateYAxis)
            .attr('class', 'explodingBoxplot y axis')
            .attr('id', 'xpb_yAxis')
          .call(yAxis);

        chartWrapper.selectAll('g.y.axis')
          .append('text')
            .attr('class', 'axis text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -options.margin.top - d3.mean(yScale.range()))
            .attr('dy', '.71em')
            .attr('y', -options.margin.left + 5)
            .style('font', '10px sans-serif')
            .style('text-anchor', 'middle')
            .style('fill', 'black')
            .text(options.axes.y.label);

        // style the axis text
        chartWrapper.selectAll('.axis text')
          .style('font', '10px sans-serif');

        const boxContent = chartWrapper.selectAll('.boxcontent')
          .data(groups);
        console.log('boxContent after variable declaration', boxContent);

        boxContent.enter()
          .append('g')
          .merge(boxContent)
          .attr('class', 'explodingBoxplot boxcontent')
          .attr('id', (d, i) => `explodingBoxplot${options.id}${i}`);
        console.log('boxContent after enter', boxContent);

        boxContent.exit()
          .remove();
        console.log('boxContent after exit', boxContent);
 
        // d3.select('.chartWrapper').selectAll('g.explodingBoxplot.boxcontent')
        chartWrapper.selectAll('g.explodingBoxplot.boxcontent')          .attr('transform', d => `translate(${xScale(d.group)},0)`)
          .each(function (d, i) {
            // console.log('d, testing selection.each', d);
            // console.log('i, testing selection.each', i);
          })
          .each(createJitter)
          .each((d, i) => {
            console.log('d from boxContent each', d);
            // console.log('this from boxContent each', this);
            const selector = `#explodingBoxplot${i}`;
            console.log('selector from createBoxplot call', selector);
            const createBoxplotOptions = {
              chartOptions: options,
              i,
              colorScale
            };

            createBoxplot(selector, d, createBoxplotOptions);
          })
          .each((d, i) =>{
            console.log('inside of each containing drawBoxplot call');
            const drawBoxplotOptions = {
              chartOptions: options,
              transitionTime,
              xScale,
              yScale,
              colorScale,
              groups,
              events,
              constituents
            };
            drawBoxplot(d, i, drawBoxplotOptions, state);
          });

        if (events.update.end) {
          setTimeout(() => {
            events.update.end(constituents, options, events);
          }, transitionTime);
        }

      //
      // styles
      //
      chartWrapper.selectAll('rect.box')
        .style('fill-opacity', 1);

      chartWrapper.selectAll('.axis path')
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('shape-rendering', 'crispEdges');

      chartWrapper.selectAll('.axis line')
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('shape-rendering', 'crispEdges');      
        
      chartWrapper.selectAll('line.explodingBoxplot.line')
        .style('stroke', '#888')
        .style('stroke-width', '2px');

      chartWrapper.selectAll('rect.explodingBoxplot.box')
        .style('stroke', '#888')
        .style('stroke-width', '2px');

      chartWrapper.selectAll('line.explodingBoxplot.vline')
        .style('stroke-dasharray', '5,5');

      // style the tooltip
      domParent.selectAll('explodingBoxplot.tip')
        .style('font', 'normal 13px Lato, Open sans, sans-serif')
        .style('line-height', 1)
        .style('font-weight', 'bold')
        .style('padding', '12px')
        .style('background', '#333333')
        .style('color', '#DDDDDD')
        .style('border-radius', '2px')

      chartWrapper.selectAll('g.tick text')
        .style('-webkit-user-select', 'none')
        .style('-khtml-user-select', 'none')
        .style('-moz-user-select', 'none')
        .style('-o-user-select', 'none')
        .style('user-select', 'none')
        .style('cursor', 'default');

      chartWrapper.selectAll('g.axis text')
        .style('-webkit-user-select', 'none')
        .style('-khtml-user-select', 'none')
        .style('-moz-user-select', 'none')
        .style('-o-user-select', 'none')
        .style('user-select', 'none')
        .style('cursor', 'default');
      }; // end update()
    });
}

  // ACCESSORS

  // chart.options() allows updating individual options and suboptions
  // while preserving state of other options
  chart.options = function (values, ...args) {
    // console.log('chart.options() was called');
    if (!args) return options;
    keyWalk(values, options);
    return chart;
  };

  chart.events = function (functions, ...args) {
    // console.log('chart.events() was called');
    if (!args) return events;
    keyWalk(functions, events);
    return chart;
  };

  chart.constituents = () => state.constituents;

  chart.colors = function (color3s, ...args) {
    // console.log('chart.colors() was called');
    // no arguments, return present value
    if (!args) return colors;

    // argument is not object            
    if (typeof color3s !== 'object') return false;
    const keys = Object.keys(color3s);

    // object is empty
    if (!keys.length) return false;
    
      // remove all properties that are not colors
    keys.forEach(f => {
      if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f];
    });
    if (Object.keys(color3s).length) {
      colors = color3s;
    } else {
      // no remaining properties, revert to default
      colors = JSON.parse(JSON.stringify(defaultColors));
    }
    return chart;
  };

  chart.width = function (value, ...args) {
    // console.log('chart.width() was called');
    if (!args) return options.width;
    options.width = value;
    return chart;
  };

  chart.height = function (value, ...args) {
    // console.log('chart.height() was called');
    if (!args) return options.height;
    options.height = value;
    return chart;
  };

  chart.data = function (value, ...args) {
    // console.log('chart.data() was called');
    // console.log('value from chart.data', value);
    // console.log('args from chart.data', args);
    if (!args) return dataSet;
    // this appears to be specific to the @tennisvisuals atpWta.json dataset
    // value.sort((x, y) => x['Set Score'].split('-').join('') - y['Set Score'].split('-').join(''));
    dataSet = JSON.parse(JSON.stringify(value));
    return chart;
  };

  chart.push = function (value, ...args) {
    // console.log('chart.push() was called');
    const privateValue = JSON.parse(JSON.stringify(value));
    if (!args) return false;
    if (privateValue.constructor === Array) {
      for (let i = 0; i < privateValue.length; i++) {
        dataSet.push(privateValue[i]);
        privateDataSet.push(privateValue[i]);
      }
    } else {
      dataSet.push(privateValue);
      privateDataSet.push(privateValue);
    }
    return true;
  };

  chart.pop = () => {
    // console.log('chart.pop() was called');
    if (!dataSet.length) return undefined;
    // const count = dataSet.length;
    privateDataSet.pop();
    return dataSet.pop();
  };

  chart.update = resize => {
    // console.log('chart.update() was called');
    if (typeof update === 'function') update(resize);
  };

  chart.duration = function (value, ...args) {
    // console.log('chart.duration() was called');
    if (!args) return transitionTime;
    transitionTime = value;
    return chart;
  };

  // END ACCESSORS
  return chart;
}
