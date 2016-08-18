// http://mcaule.github.io/d3_exploding_boxplot Version 0.2.1. Copyright 2016 @micahstubbs.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.explodingBoxplot = global.explodingBoxplot || {})));
}(this, function (exports) { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  /*
  eslint
  no-undef: "off",
  func-names: "off",
  no-use-before-define: "off",
  no-console: "off",
  no-unused-vars: "off"
  */
  // import d3Tip from './d3-tip';

  function d3_exploding_boxplot () {
    // options which should be accessible via ACCESSORS
    var dataSet = [];
    var privateDataSet = [];

    var groups = void 0;
    var explodedBoxPlots = [];

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
      selection.each(function () {
        var domParent = d3.select(this);
        console.log('domParent', domParent);
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
          chartRoot.attr('width', options.width + options.margins.left + options.margins.right).attr('height', options.height + options.margins.top + options.margins.bottom);

          chartWrapper.attr('transform', 'translate(' + options.margins.left + ',' + options.margins.top + ')');

          console.log('events.update.begin', events.update.begin);
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
          console.log('groups after nest', groups);

          var xScale = d3.scale.ordinal().domain(groups.map(function (d) {
            return d.key;
          })).rangeRoundBands([0, options.width - options.margins.left - options.margins.right], options.display.boxpadding);

          constituents.scales.X = xScale;
          console.log('xScale.domain()', xScale.domain());
          console.log('xScale.range()', xScale.range());

          // create boxplot data
          groups = groups.map(function (g) {
            var o = computeBoxplot(g.values, options.display.iqr, options.axes.y.label);
            o.group = g.key;
            return o;
          });
          console.log('groups after map', groups);

          var yScale = d3.scale.linear().domain(d3.extent(dataSet.map(function (m) {
            return m[options.axes.y.label];
          }))).range([options.height - options.margins.top - options.margins.bottom, 0]).nice();

          constituents.scales.Y = yScale;
          console.log('yScale.domain()', yScale.domain());
          console.log('yScale.range()', yScale.range());

          var colorScale = d3.scale.ordinal().domain(d3.set(dataSet.map(function (m) {
            return m[options.data.color_index];
          })).values()).range(Object.keys(colors).map(function (m) {
            return colors[m];
          }));
          console.log('colorScale.domain()', colorScale.domain());
          console.log('colorScale.range()', colorScale.range());

          constituents.scales.color = colorScale;

          console.log('events.update.ready', events.update.ready);
          if (events.update.ready) {
            events.update.ready(constituents, options, events);
          }

          var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
          console.log('xAxis', xAxis);

          var yAxis = d3.svg.axis().scale(yScale).orient('left').tickFormat(options.axes.y.tickFormat);
          console.log('yAxis', yAxis);

          resetArea.on('dblclick', implodeBoxplot);

          var updateXAxis = chartWrapper.selectAll('#xpb_xAxis').data([0]);
          console.log('updateXAxis', updateXAxis);
          console.log('updateXAxis[0]', updateXAxis[0]);

          updateXAxis.enter().append('g').attr('class', 'explodingBoxplot x axis').attr('id', 'xpb_xAxis').append('text').attr('class', 'axis text');

          updateXAxis.exit().remove();

          updateXAxis.attr('transform', 'translate(0,' + (options.height - options.margins.top - options.margins.bottom) + ')').call(xAxis).select('.axis.text').attr('x', (options.width - options.margins.left - options.margins.right) / 2).attr('dy', '.71em').attr('y', options.margins.bottom - 10).style('text-anchor', 'middle').text(options.axes.x.label);
          console.log('d3.selectAll(\'.x.axis\')', d3.selectAll('.x.axis'));

          var updateYAxis = chartWrapper.selectAll('#xpb_yAxis').data([0]);

          updateYAxis.enter().append('g').attr('class', 'explodingBoxplot y axis').attr('id', 'xpb_yAxis').append('text').attr('class', 'axis text');

          updateYAxis.exit().remove();

          updateYAxis.call(yAxis).select('.axis.text').attr('transform', 'rotate(-90)').attr('x', -options.margins.top - d3.mean(yScale.range())).attr('dy', '.71em').attr('y', -options.margins.left + 5).style('text-anchor', 'middle').text(options.axes.y.label);

          var boxContent = chartWrapper.selectAll('.boxcontent').data(groups);
          console.log('boxContent', boxContent);

          boxContent.enter().append('g').attr('class', 'explodingBoxplot boxcontent').attr('id', function (d, i) {
            return 'explodingBoxplot' + options.id + i;
          });
          console.log('boxContent after enter', boxContent);

          boxContent.exit().remove();

          boxContent.attr('transform', function (d) {
            return 'translate(' + xScale(d.group) + ',0)';
          }).each(createJitter).each(createBoxplot).each(drawBoxplot);

          function createJitter() /* g, i*/{
            d3.select(this).append('g').attr('class', 'explodingBoxplot outliers-points');
            d3.select(this).append('g').attr('class', 'explodingBoxplot normal-points');
          }

          function initJitter(s) {
            console.log('initJitter() was called');
            s.attr('class', 'explodingBoxplot point').attr('r', options.datapoints.radius).attr('fill', function (d) {
              return colorScale(d[options.data.color_index]);
            }).on('mouseover', function (d, i /* , self */) {
              if (events.point && typeof events.point.mouseover === 'function') {
                events.point.mouseover(d, i, d3.select(this), constituents, options);
              }
            }).on('mouseout', function (d, i /* , self */) {
              if (events.point && typeof events.point.mouseout === 'function') {
                events.point.mouseout(d, i, d3.select(this), constituents, options);
              }
            }).on('click', function (d, i /* , self */) {
              if (events.point && typeof events.point.click === 'function') {
                events.point.click(d, i, d3.select(this), constituents, options);
              }
            });
          }

          function drawJitter(s) {
            s.attr('r', options.datapoints.radius).attr('fill', function (d) {
              return colorScale(d[options.data.color_index]);
            }).attr('cx', function () /* d */{
              var w = xScale.rangeBand();
              return Math.floor(Math.random() * w);
            }).attr('cy', function (d) {
              return yScale(d[options.axes.y.label]);
            });
          }

          function createBoxplot(g, i) {
            console.log('this from createBoxplot', this);
            var s = d3.select(this).append('g').attr('class', 'explodingBoxplot box').attr('id', 'explodingBoxplot_box' + options.id + i).selectAll('.box').data([g]).enter();

            s.append('rect').attr('class', 'explodingBoxplot box').attr('fill', function (d) {
              return colorScale(d.normal[0][options.data.color_index]);
            });

            s.append('line').attr('class', 'explodingBoxplot median line'); // median line
            s.append('line').attr('class', 'explodingBoxplot min line hline'); // min line
            s.append('line').attr('class', 'explodingBoxplot line min vline'); // min vline
            s.append('line').attr('class', 'explodingBoxplot max line hline'); // max line
            s.append('line').attr('class', 'explodingBoxplot line max vline'); // max vline
          }

          function drawBoxplot(s, i) {
            d3.select('#explodingBoxplot_box' + options.id + i).on('click', function () /* d */{
              explodeBoxplot(i);
              explodedBoxPlots.push(i);
            });

            s = d3.select(this);
            if (explodedBoxPlots.indexOf(i) >= 0) {
              explodeBoxplot(i);
              jitterPlot(i);
              return;
            }
            jitterPlot(i);

            // box
            s.select('rect.box').transition().duration(transitionTime).attr('x', 0).attr('width', xScale.rangeBand()).attr('y', function (d) {
              return yScale(d.quartiles[2]);
            }).attr('height', function (d) {
              return yScale(d.quartiles[0]) - yScale(d.quartiles[2]);
            }).attr('fill', function (d) {
              return colorScale(d.normal[0][options.data.color_index]);
            });

            // median line
            s.select('line.median').transition().duration(transitionTime).attr('x1', 0).attr('x2', xScale.rangeBand()).attr('y1', function (d) {
              return yScale(d.quartiles[1]);
            }).attr('y2', function (d) {
              return yScale(d.quartiles[1]);
            });

            // min line
            s.select('line.min.hline').transition().duration(transitionTime).attr('x1', xScale.rangeBand() * 0.25).attr('x2', xScale.rangeBand() * 0.75).attr('y1', function (d) {
              return yScale(Math.min(d.min, d.quartiles[0]));
            }).attr('y2', function (d) {
              return yScale(Math.min(d.min, d.quartiles[0]));
            });

            // min vline
            s.select('line.min.vline').transition().duration(transitionTime).attr('x1', xScale.rangeBand() * 0.5).attr('x2', xScale.rangeBand() * 0.5).attr('y1', function (d) {
              return yScale(Math.min(d.min, d.quartiles[0]));
            }).attr('y2', function (d) {
              return yScale(d.quartiles[0]);
            });

            // max line
            s.select('line.max.hline').transition().duration(transitionTime).attr('x1', xScale.rangeBand() * 0.25).attr('x2', xScale.rangeBand() * 0.75).attr('y1', function (d) {
              return yScale(Math.max(d.max, d.quartiles[2]));
            }).attr('y2', function (d) {
              return yScale(Math.max(d.max, d.quartiles[2]));
            });

            // max vline
            s.select('line.max.vline').transition().duration(transitionTime).attr('x1', xScale.rangeBand() * 0.5).attr('x2', xScale.rangeBand() * 0.5).attr('y1', function (d) {
              return yScale(d.quartiles[2]);
            }).attr('y2', function (d) {
              return yScale(Math.max(d.max, d.quartiles[2]));
            });
          }

          function hideBoxplot() /* g, i */{
            var s = this;

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

          function explodeBoxplot(i) {
            d3.select('#explodingBoxplot' + options.id + i).select('g.box').transition().ease(d3.ease('back-in')).duration(transitionTime * 1.5).call(hideBoxplot);

            var explodeNormal = d3.select('#explodingBoxplot' + options.id + i).select('.normal-points').selectAll('.point').data(groups[i].normal);

            explodeNormal.enter().append('circle');

            explodeNormal.exit().remove();

            explodeNormal.attr('cx', xScale.rangeBand() * 0.5).attr('cy', yScale(groups[i].quartiles[1])).call(initJitter).transition().ease(d3.ease('back-out')).delay(function () {
              return transitionTime * 1.5 + 100 * Math.random();
            }).duration(function () {
              return transitionTime * 1.5 + transitionTime * 1.5 * Math.random();
            }).call(drawJitter);
          }

          function jitterPlot(i) {
            var elem = d3.select('#explodingBoxplot' + options.id + i).select('.outliers-points');

            var displayOutliers = elem.selectAll('.point').data(groups[i].outlier);

            displayOutliers.enter().append('circle');

            displayOutliers.exit().remove();

            displayOutliers.attr('cx', xScale.rangeBand() * 0.5).attr('cy', yScale(groups[i].quartiles[1])).call(initJitter).transition().ease(d3.ease('back-out')).delay(function () {
              return transitionTime * 1.5 + 100 * Math.random();
            }).duration(function () {
              return transitionTime * 1.5 + transitionTime * 1.5 * Math.random();
            }).call(drawJitter);
          }

          function implodeBoxplot() /* elem, g */{
            explodedBoxPlots = [];
            chartWrapper.selectAll('.normal-points').each(function (g) {
              d3.select(this).selectAll('circle').transition().ease(d3.ease('back-out')).duration(function () {
                return transitionTime * 1.5 + transitionTime * 1.5 * Math.random();
              }).attr('cx', xScale.rangeBand() * 0.5).attr('cy', yScale(g.quartiles[1])).remove();
            });

            chartWrapper.selectAll('.boxcontent').transition().ease(d3.ease('back-out')).duration(transitionTime * 1.5).delay(transitionTime).each(drawBoxplot);
          }

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
      if (!arguments.length) return options;
      keyWalk(values, options);
      return chart;
    };

    function keyWalk(valuesObject, optionsObject) {
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

    chart.events = function (functions) {
      if (!arguments.length) return events;
      keyWalk(functions, events);
      return chart;
    };

    chart.constituents = function () {
      return constituents;
    };

    chart.colors = function (color3s) {
      // no arguments, return present value
      if (!arguments.length) return colors;

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
      if (!arguments.length) return options.width;
      options.width = value;
      return chart;
    };

    chart.height = function (value) {
      if (!arguments.length) return options.height;
      options.height = value;
      return chart;
    };

    chart.data = function (value) {
      if (!arguments.length) return dataSet;
      value.sort(function (x, y) {
        return x['Set Score'].split('-').join('') - y['Set Score'].split('-').join('');
      });
      dataSet = JSON.parse(JSON.stringify(value));
      return chart;
    };

    chart.push = function (value) {
      var privateValue = JSON.parse(JSON.stringify(value));
      if (!arguments.length) return false;
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
      if (!dataSet.length) return undefined;
      // const count = dataSet.length;
      privateDataSet.pop();
      return dataSet.pop();
    };

    chart.update = function (resize) {
      if (typeof update === 'function') update(resize);
    };

    chart.duration = function (value) {
      if (!arguments.length) return transitionTime;
      transitionTime = value;
      return chart;
    };

    // END ACCESSORS

    var computeBoxplot = function computeBoxplot(data, iqrScalingFactor, value) {
      iqrScalingFactor = iqrScalingFactor || 1.5;
      value = value || Number;

      var seriev = data.map(function (m) {
        return m[value];
      }).sort(d3.ascending);

      var quartiles = [d3.quantile(seriev, 0.25), d3.quantile(seriev, 0.5), d3.quantile(seriev, 0.75)];

      var iqr = (quartiles[2] - quartiles[0]) * iqrScalingFactor;

      // separate outliers
      var max = Number.MIN_VALUE;
      var min = Number.MAX_VALUE;
      var boxData = d3.nest().key(function (d) {
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
    };

    return chart;
  }

  exports.plot = d3_exploding_boxplot;

  Object.defineProperty(exports, '__esModule', { value: true });

}));