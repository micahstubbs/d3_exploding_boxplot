// http://mcaule.github.io/d3_exploding_boxplot Version 0.2.1. Copyright 2016 @micahstubbs.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
  (factory((global.explodingBoxplot = global.explodingBoxplot || {}),global.d3));
}(this, function (exports,d3$1) { 'use strict';

  function initJitter(s, options) {
    console.log('initJitter() was called');

    var chartOptions = options.chartOptions;
    var colorScale = options.colorScale;
    var events = options.events;
    var constituents = options.constituents;

    s.attr('class', 'explodingBoxplot point').attr('r', chartOptions.datapoints.radius).attr('fill', function (d) {
      return colorScale(d[chartOptions.data.color_index]);
    }).on('mouseover', function (d, i /* , self */) {
      if (events.point && typeof events.point.mouseover === 'function') {
        events.point.mouseover(d, i, d3$1.select(this), constituents, chartOptions);
      }
    }).on('mouseout', function (d, i /* , self */) {
      if (events.point && typeof events.point.mouseout === 'function') {
        events.point.mouseout(d, i, d3$1.select(this), constituents, chartOptions);
      }
    }).on('click', function (d, i /* , self */) {
      if (events.point && typeof events.point.click === 'function') {
        events.point.click(d, i, d3$1.select(this), constituents, chartOptions);
      }
    });
  }

  function drawJitter(selection, options) {
    console.log('drawJitter() was called');

    var chartOptions = options.chartOptions;
    var colorScale = options.colorScale;
    var xScale = options.xScale;
    var yScale = options.yScale;

    selection.attr('r', chartOptions.datapoints.radius).attr('fill', function (d) {
      return colorScale(d[chartOptions.data.color_index]);
    }).attr('cx', function () /* d */{
      var w = xScale.rangeBand();
      return Math.floor(Math.random() * w);
    }).attr('cy', function (d) {
      return yScale(d[chartOptions.axes.y.label]);
    });
  }

  function jitterPlot(i, options) {
    console.log('jitterPlot() was called');

    var chartOptions = options.chartOptions;
    var colorScale = options.colorScale;
    var xScale = options.xScale;
    var yScale = options.yScale;
    var groups = options.groups;
    var events = options.events;
    var constituents = options.constituents;
    var transitionTime = options.transitionTime;

    var elem = d3$1.select('#explodingBoxplot' + chartOptions.id + i).select('.outliers-points');

    var displayOutliers = elem.selectAll('.point').data(groups[i].outlier);

    displayOutliers.enter().append('circle');

    displayOutliers.exit().remove();

    var drawJitterOptions = {
      chartOptions: chartOptions,
      colorScale: colorScale,
      xScale: xScale,
      yScale: yScale
    };

    var initJitterOptions = {
      chartOptions: chartOptions,
      colorScale: colorScale,
      events: events,
      constituents: constituents
    };

    displayOutliers.attr('cx', xScale.rangeBand() * 0.5).attr('cy', yScale(groups[i].quartiles[1])).call(initJitter, initJitterOptions).transition().ease(d3$1.ease('back-out')).delay(function () {
      return transitionTime * 1.5 + 100 * Math.random();
    }).duration(function () {
      return transitionTime * 1.5 + transitionTime * 1.5 * Math.random();
    }).call(drawJitter, drawJitterOptions);
  }

  function hideBoxplot(g, options) {
    console.log('hideBoxplot() was called');

    // console.log('arguments', arguments);
    var s = this;
    var xScale = options.xScale;
    var yScale = options.yScale;

    s.select('rect.box').attr('x', xScale.rangeBand() * 0.5).attr('width', 0).attr('y', function (d) {
      return yScale(d.quartiles[1]);
    }).attr('height', 0);

    // median line
    s.selectAll('line').attr('x1', xScale.rangeBand() * 0.5).attr('x2', xScale.rangeBand() * 0.5).attr('y1', function (d) {
      return yScale(d.quartiles[1]);
    }).attr('y2', function (d) {
      return yScale(d.quartiles[1]);
    });
  }

  function explodeBoxplot(i, options) {
    console.log('explodeBoxplot() was called');

    var xScale = options.xScale;
    var yScale = options.yScale;
    var colorScale = options.colorScale;
    var chartOptions = options.chartOptions;
    var events = options.events;
    var constituents = options.constituents;
    var transitionTime = options.transitionTime;
    var groups = options.groups;

    var hideBoxplotOptions = {
      xScale: xScale,
      yScale: yScale
    };

    d3$1.select('#explodingBoxplot' + chartOptions.id + i).select('g.box').transition().ease(d3$1.ease('back-in')).duration(transitionTime * 1.5).call(hideBoxplot, hideBoxplotOptions);

    var explodeNormal = d3$1.select('#explodingBoxplot' + chartOptions.id + i).select('.normal-points').selectAll('.point').data(groups[i].normal);
    explodeNormal.enter().append('circle');
    explodeNormal.exit().remove();

    var drawJitterOptions = {
      chartOptions: chartOptions,
      colorScale: colorScale,
      xScale: xScale,
      yScale: yScale
    };

    var initJitterOptions = {
      chartOptions: chartOptions,
      colorScale: colorScale,
      events: events,
      constituents: constituents
    };

    explodeNormal.attr('cx', xScale.rangeBand() * 0.5).attr('cy', yScale(groups[i].quartiles[1])).call(initJitter, initJitterOptions).transition().ease(d3$1.ease('back-out')).delay(function () {
      return transitionTime * 1.5 + 100 * Math.random();
    }).duration(function () {
      return transitionTime * 1.5 + transitionTime * 1.5 * Math.random();
    }).call(drawJitter, drawJitterOptions);
  }

  function drawBoxplot(d, i, options, state) {
    console.log('drawBoxplot() was called');
    var chartOptions = options.chartOptions; // TODO: better names here
    var transitionTime = options.transitionTime;
    var xScale = options.xScale;
    var yScale = options.yScale;
    var colorScale = options.colorScale;
    var groups = options.groups;
    var events = options.events;
    var constituents = options.constituents;

    var explodeBoxplotOptions = {
      xScale: xScale,
      yScale: yScale,
      colorScale: colorScale,
      chartOptions: chartOptions,
      events: events,
      constituents: constituents,
      transitionTime: transitionTime,
      groups: groups
    };
    var s = d3$1.select('#explodingBoxplot_box' + chartOptions.id + i).on('click', function () /* d */{
      explodeBoxplot(i, explodeBoxplotOptions);
      state.explodedBoxplots.push(i);
      // console.log('state.explodedBoxplots', state.explodedBoxplots);
    });

    // const s = d3.select(this);
    if (state.explodedBoxplots.indexOf(i) >= 0) {
      explodeBoxplot(i, explodeBoxplotOptions);
      jitterPlot(i, chartOptions);
      return;
    }

    // console.log('s from drawBoxplot', s);
    var jitterPlotOptions = {
      chartOptions: chartOptions,
      colorScale: colorScale,
      xScale: xScale,
      yScale: yScale,
      groups: groups,
      events: events,
      constituents: constituents,
      transitionTime: transitionTime
    };

    jitterPlot(i, jitterPlotOptions);

    // box
    s.select('rect.box').transition().duration(transitionTime).attr('x', 0).attr('width', xScale.rangeBand()).attr('y', function (e) {
      return yScale(e.quartiles[2]);
    }).attr('height', function (e) {
      return yScale(e.quartiles[0]) - yScale(e.quartiles[2]);
    }).attr('fill', function (e) {
      return colorScale(e.normal[0][chartOptions.data.color_index]);
    });

    // median line
    s.select('line.median').transition().duration(transitionTime).attr('x1', 0).attr('x2', xScale.rangeBand()).attr('y1', function (e) {
      return yScale(e.quartiles[1]);
    }).attr('y2', function (e) {
      return yScale(e.quartiles[1]);
    });

    // min line
    s.select('line.min.hline').transition().duration(transitionTime).attr('x1', xScale.rangeBand() * 0.25).attr('x2', xScale.rangeBand() * 0.75).attr('y1', function (e) {
      return yScale(Math.min(e.min, e.quartiles[0]));
    }).attr('y2', function (e) {
      return yScale(Math.min(e.min, e.quartiles[0]));
    });

    // min vline
    s.select('line.min.vline').transition().duration(transitionTime).attr('x1', xScale.rangeBand() * 0.5).attr('x2', xScale.rangeBand() * 0.5).attr('y1', function (e) {
      return yScale(Math.min(e.min, e.quartiles[0]));
    }).attr('y2', function (e) {
      return yScale(e.quartiles[0]);
    });

    // max line
    s.select('line.max.hline').transition().duration(transitionTime).attr('x1', xScale.rangeBand() * 0.25).attr('x2', xScale.rangeBand() * 0.75).attr('y1', function (e) {
      return yScale(Math.max(e.max, e.quartiles[2]));
    }).attr('y2', function (e) {
      return yScale(Math.max(e.max, e.quartiles[2]));
    });

    // max vline
    s.select('line.max.vline').transition().duration(transitionTime).attr('x1', xScale.rangeBand() * 0.5).attr('x2', xScale.rangeBand() * 0.5).attr('y1', function (e) {
      return yScale(e.quartiles[2]);
    }).attr('y2', function (e) {
      return yScale(Math.max(e.max, e.quartiles[2]));
    });
  }

  function implodeBoxplot(selector, options, state) {
    console.log('implodeBoxplot() was called');
    var xScale = options.xScale;
    var yScale = options.yScale;
    var transitionTime = options.transitionTime;
    var colorScale = options.colorScale;
    var chartOptions = options.chartOptions;
    var groups = options.groups;
    var events = options.events;
    var constituents = options.constituents;

    state.explodedBoxplots = [];
    console.log('state.explodedBoxplots', state.explodedBoxplots);
    selector.selectAll('.normal-points').each(function (g) {
      d3$1.select(this).selectAll('circle').transition().ease(d3$1.ease('back-out')).duration(function () {
        return transitionTime * 1.5 + transitionTime * 1.5 * Math.random();
      }).attr('cx', xScale.rangeBand() * 0.5).attr('cy', yScale(g.quartiles[1])).remove();
    });

    selector.selectAll('.boxcontent').transition().ease(d3$1.ease('back-out')).duration(transitionTime * 1.5).delay(transitionTime).each(function (d, i) {
      var drawBoxplotOptions = {
        chartOptions: chartOptions,
        transitionTime: transitionTime,
        xScale: xScale,
        yScale: yScale,
        colorScale: colorScale,
        groups: groups,
        events: events,
        constituents: constituents
      };
      drawBoxplot(d, i, drawBoxplotOptions, state);
    });
  }

  function createJitter() {
    console.log('createJitter() was called');
    var selector = this;
    console.log('this from createJitter', this);

    d3$1.select(selector).append('g').attr('class', 'explodingBoxplot outliers-points');

    d3$1.select(selector).append('g').attr('class', 'explodingBoxplot normal-points');
  }

  function createBoxplot(selector, data, options) {
    console.log('createBoxplot() was called');

    // console.log('selector from createBoxplot', selector);
    // console.log('d3.select(selector)', d3.select(selector));
    var i = options.i;
    var g = data;
    var chartOptions = options.chartOptions;
    var colorScale = options.colorScale;

    // console.log('this from createBoxplot', this);
    var s = d3$1.select(selector).append('g').attr('class', 'explodingBoxplot box').attr('id', 'explodingBoxplot_box' + chartOptions.id + i).selectAll('.box').data([g]).enter();

    s.append('rect').attr('class', 'explodingBoxplot box').attr('fill', function (d) {
      console.log('d from createBoxplot', d);
      colorScale(d.normal[0][chartOptions.data.color_index]);
    });

    s.append('line').attr('class', 'explodingBoxplot median line'); // median line
    s.append('line').attr('class', 'explodingBoxplot min line hline'); // min line
    s.append('line').attr('class', 'explodingBoxplot line min vline'); // min vline
    s.append('line').attr('class', 'explodingBoxplot max line hline'); // max line
    s.append('line').attr('class', 'explodingBoxplot line max vline'); // max vline
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function keyWalk(valuesObject, optionsObject) {
    console.log('keyWalk() was called');
    if (!valuesObject || !optionsObject) return;
    var vKeys = Object.keys(valuesObject);
    var oKeys = Object.keys(optionsObject);
    for (var k = 0; k < vKeys.length; k++) {
      if (oKeys.indexOf(vKeys[k]) >= 0) {
        var oo = optionsObject[vKeys[k]];
        var vo = valuesObject[vKeys[k]];
        if ((typeof oo === 'undefined' ? 'undefined' : _typeof(oo)) === 'object' && typeof vo !== 'function') {
          keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
        } else {
          optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
        }
      }
    }
  }

  function computeBoxplot(data, iqrScalingFactor, value) {
    console.log('computeBoxplot() was called');

    console.log('arguments from computeBoxplot: data, iqrScalingFactor, value', arguments);
    iqrScalingFactor = iqrScalingFactor || 1.5;
    value = value || Number;
    var seriev = data.map(function (m) {
      return m[value];
    }).sort(d3$1.ascending);
    var quartiles = [d3$1.quantile(seriev, 0.25), d3$1.quantile(seriev, 0.5), d3$1.quantile(seriev, 0.75)];
    console.log('quartiles from computeBoxplot', quartiles);
    var iqr = (quartiles[2] - quartiles[0]) * iqrScalingFactor;
    console.log('iqr from computeBoxplot', iqr);
    // separate outliers
    var max = Number.MIN_VALUE;
    var min = Number.MAX_VALUE;
    var boxData = d3$1.nest().key(function (d) {
      var v = d[value];
      var type = v < quartiles[0] - iqr || v > quartiles[2] + iqr ? 'outlier' : 'normal';
      if (type === 'normal' && (v < min || v > max)) {
        max = Math.max(max, v);
        min = Math.min(min, v);
      }
      return type;
    }).map(data);
    if (!boxData.outlier) boxData.outlier = [];
    boxData.quartiles = quartiles;
    boxData.iqr = iqr;
    boxData.max = max;
    boxData.min = min;
    return boxData;
  }

  function d3_exploding_boxplot () {
    // options which should be accessible via ACCESSORS
    var dataSet = [];
    var privateDataSet = [];

    var groups = void 0;

    // create state object for shared state
    // TODO: find a better pattern
    var state = {};
    state.explodedBoxplots = [];

    var options = {
      id: '',
      class: 'xBoxPlot',
      width: window.innerWidth,
      height: window.innerHeight,
      margins: {
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
          tickFormat: function tickFormat(n) {
            return n.toLocaleString();
          },

          domain: undefined
        }
      },
      data: {
        color_index: 'color',
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

    var constituents = {
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

    var mobileScreen = $(window).innerWidth() < options.mobileScreenMax;

    var defaultColors = {
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
    var colors = JSON.parse(JSON.stringify(defaultColors));

    var update = void 0;

    // programmatic
    var transitionTime = 200;

    // DEFINABLE EVENTS
    // Define with ACCESSOR function chart.events()
    var events = {
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
      selection.each(function () {
        var domParent = d3.select(this);
        // console.log('domParent', domParent);
        constituents.elements.domParent = domParent;

        var chartRoot = domParent.append('svg').attr('class', 'svg-class');
        constituents.elements.chartRoot = chartRoot;

        // background click area added first
        var resetArea = chartRoot.append('g').append('rect').attr('id', 'resetArea').attr('width', options.width).attr('height', options.height).style('color', 'white').style('opacity', 0);

        // main chart area
        var chartWrapper = chartRoot.append('g').attr('class', 'chartWrapper').attr('id', 'chartWrapper' + options.id);

        mobileScreen = $(window).innerWidth() < options.mobileScreenMax;

        // boolean resize used to disable transitions during resize operation
        update = function update(resize) {
          console.log('update/resize function was called');
          chartRoot.attr('width', options.width + options.margins.left + options.margins.right).attr('height', options.height + options.margins.top + options.margins.bottom);

          chartWrapper.attr('transform', 'translate(' + options.margins.left + ',' + options.margins.top + ')');

          // console.log('events.update.begin', events.update.begin);
          if (events.update.begin) {
            events.update.begin(constituents, options, events);
          }

          console.log('options.data.group', options.data.group);
          if (options.data.group) {
            groups = d3.nest().key(function (k) {
              return k[options.data.group];
            }).entries(dataSet);
          } else {
            groups = [{
              key: '',
              values: dataSet
            }];
          }
          // console.log('groups after nest', groups);

          var xScale = d3.scale.ordinal().domain(groups.map(function (d) {
            return d.key;
          })).rangeRoundBands([0, options.width - options.margins.left - options.margins.right], options.display.boxpadding);

          constituents.scales.X = xScale;
          // console.log('xScale.domain()', xScale.domain());
          // console.log('xScale.range()', xScale.range());

          // create boxplot data
          groups = groups.map(function (g) {
            console.log('g from groups map', g);
            var o = computeBoxplot(g.values, options.display.iqr, options.axes.y.label);
            o.group = g.key;
            return o;
          });
          // console.log('groups after map', groups);

          var yScale = d3.scale.linear().domain(d3.extent(dataSet.map(function (m) {
            return m[options.axes.y.label];
          }))).range([options.height - options.margins.top - options.margins.bottom, 0]).nice();

          constituents.scales.Y = yScale;
          // console.log('yScale.domain()', yScale.domain());
          // console.log('yScale.range()', yScale.range());

          var colorScale = d3.scale.ordinal().domain(d3.set(dataSet.map(function (m) {
            return m[options.data.color_index];
          })).values()).range(Object.keys(colors).map(function (m) {
            return colors[m];
          }));
          // console.log('colorScale.domain()', colorScale.domain());
          // console.log('colorScale.range()', colorScale.range());

          constituents.scales.color = colorScale;

          // console.log('events.update.ready', events.update.ready);
          if (events.update.ready) {
            events.update.ready(constituents, options, events);
          }

          var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
          // console.log('xAxis', xAxis);

          var yAxis = d3.svg.axis().scale(yScale).orient('left').tickFormat(options.axes.y.tickFormat);
          // console.log('yAxis', yAxis);

          var implodeBoxplotOptions = {
            xScale: xScale,
            yScale: yScale,
            transitionTime: transitionTime,
            colorScale: colorScale,
            chartOptions: options,
            groups: groups,
            events: events,
            constituents: constituents
          };

          resetArea.on('dblclick', function () {
            implodeBoxplot(chartWrapper, implodeBoxplotOptions, state);
          });

          var updateXAxis = chartWrapper.selectAll('#xpb_xAxis').data([0]);
          // console.log('updateXAxis', updateXAxis);
          // console.log('updateXAxis[0]', updateXAxis[0])

          updateXAxis.enter().append('g').attr('class', 'explodingBoxplot x axis').attr('id', 'xpb_xAxis').append('text').attr('class', 'axis text');

          updateXAxis.exit().remove();

          updateXAxis.attr('transform', 'translate(0,' + (options.height - options.margins.top - options.margins.bottom) + ')').call(xAxis).select('.axis.text').attr('x', (options.width - options.margins.left - options.margins.right) / 2).attr('dy', '.71em').attr('y', options.margins.bottom - 10).style('text-anchor', 'middle').text(options.axes.x.label);
          // console.log(`d3.selectAll('.x.axis')`, d3.selectAll('.x.axis'));

          var updateYAxis = chartWrapper.selectAll('#xpb_yAxis').data([0]);

          updateYAxis.enter().append('g').attr('class', 'explodingBoxplot y axis').attr('id', 'xpb_yAxis').append('text').attr('class', 'axis text');

          updateYAxis.exit().remove();

          updateYAxis.call(yAxis).select('.axis.text').attr('transform', 'rotate(-90)').attr('x', -options.margins.top - d3.mean(yScale.range())).attr('dy', '.71em').attr('y', -options.margins.left + 5).style('text-anchor', 'middle').text(options.axes.y.label);

          var boxContent = chartWrapper.selectAll('.boxcontent').data(groups);
          // console.log('boxContent', boxContent);

          boxContent.enter().append('g').attr('class', 'explodingBoxplot boxcontent').attr('id', function (d, i) {
            return 'explodingBoxplot' + options.id + i;
          });
          // console.log('boxContent after enter', boxContent);

          boxContent.exit().remove();

          boxContent.attr('transform', function (d) {
            return 'translate(' + xScale(d.group) + ',0)';
          }).each(createJitter).each(function (d, i) {
            var selector = '#' + d3.select(this).attr('id');
            var createBoxplotOptions = {
              chartOptions: options,
              i: i,
              colorScale: colorScale
            };

            createBoxplot(selector, d, createBoxplotOptions);
          }).each(function (d, i) {
            var drawBoxplotOptions = {
              chartOptions: options,
              transitionTime: transitionTime,
              xScale: xScale,
              yScale: yScale,
              colorScale: colorScale,
              groups: groups,
              events: events,
              constituents: constituents
            };
            drawBoxplot(d, i, drawBoxplotOptions, state);
          });

          if (events.update.end) {
            setTimeout(function () {
              events.update.end(constituents, options, events);
            }, transitionTime);
          }
        }; // end update()
      });
    }

    // ACCESSORS

    // chart.options() allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function (values) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      console.log('chart.options() was called');
      if (!args) return options;
      keyWalk(values, options);
      return chart;
    };

    chart.events = function (functions) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      console.log('chart.events() was called');
      if (!args) return events;
      keyWalk(functions, events);
      return chart;
    };

    chart.constituents = function () {
      return state.constituents;
    };

    chart.colors = function (color3s) {
      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      console.log('chart.colors() was called');
      // no arguments, return present value
      if (!args) return colors;

      // argument is not object            
      if ((typeof color3s === 'undefined' ? 'undefined' : _typeof(color3s)) !== 'object') return false;
      var keys = Object.keys(color3s);

      // object is empty
      if (!keys.length) return false;

      // remove all properties that are not colors
      keys.forEach(function (f) {
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

    chart.width = function (value) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      console.log('chart.width() was called');
      if (!args) return options.width;
      options.width = value;
      return chart;
    };

    chart.height = function (value) {
      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      console.log('chart.height() was called');
      if (!args) return options.height;
      options.height = value;
      return chart;
    };

    chart.data = function (value) {
      for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      console.log('chart.data() was called');
      if (!args) return dataSet;
      // this appears to be specific to the @tennisvisuals atpWta.json dataset
      // value.sort((x, y) => x['Set Score'].split('-').join('') - y['Set Score'].split('-').join(''));
      dataSet = JSON.parse(JSON.stringify(value));
      return chart;
    };

    chart.push = function (value) {
      for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }

      console.log('chart.push() was called');
      var privateValue = JSON.parse(JSON.stringify(value));
      if (!args) return false;
      if (privateValue.constructor === Array) {
        for (var i = 0; i < privateValue.length; i++) {
          dataSet.push(privateValue[i]);
          privateDataSet.push(privateValue[i]);
        }
      } else {
        dataSet.push(privateValue);
        privateDataSet.push(privateValue);
      }
      return true;
    };

    chart.pop = function () {
      console.log('chart.pop() was called');
      if (!dataSet.length) return undefined;
      // const count = dataSet.length;
      privateDataSet.pop();
      return dataSet.pop();
    };

    chart.update = function (resize) {
      console.log('chart.update() was called');
      if (typeof update === 'function') update(resize);
    };

    chart.duration = function (value) {
      for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
        args[_key8 - 1] = arguments[_key8];
      }

      console.log('chart.duration() was called');
      if (!args) return transitionTime;
      transitionTime = value;
      return chart;
    };

    // END ACCESSORS
    return chart;
  }

  exports.plot = d3_exploding_boxplot;

  Object.defineProperty(exports, '__esModule', { value: true });

}));