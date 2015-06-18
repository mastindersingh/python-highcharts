(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

requirejs([
    'jquery',
    'selectize',
    'jsoneditor',
    'highstock',
    'export'
], function($, selectize, JSONEditor) {

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    var id = guid();
    plot(id);

    function plot(id) {
        var options = {};
        var options = '$#options'
        var useHighStock = true;
        var useHighStock = '$#highstock'
        var save = 'app/chart.svg';
        var save = '$#save'
        var url = 'http://127.0.0.1:37759';
        var url = '$#url'
        var path = 'small';
        var path = '$#path'

        //Create different containers for the charts
        var chartContainer = document.getElementById("chart-container");
        chartContainer.id = "chart-container" + id;

        var selectorContainer = $("#variable-selector");
        selectorContainer.attr('id', "variable-selector" + id);

        var settings = $("#settings-collapse");
        settings.attr('id', "settings-collapse" + id);

        var button = $("#settings-button");
        button.attr('id', "settings-button" + id);

        var saveButton = $("#save-settings");
        saveButton.attr('id', "save-settings" + id);

        var updateButton = $("#update-button");
        updateButton.attr('id', "update-button" + id);

        var liveToggle = $("#live-toggle");
        liveToggle.attr('id', "live-toggle" + id);

        // create the editor
        var editorContainer = document.getElementById("jsoneditor");
        editorContainer.id = "jsoneditor" + id;
        var editor = new JSONEditor(editorContainer);

        button.on('click', showSettings);
        updateButton.on('click', update);

        saveButton.on('click', function () {
            var newOptions = editor.get();
            //Prevent export from breaking
            delete newOptions.exporting;
            setOptions(newOptions);
            settings.collapse('hide');
        });

        function showSettings() {
            settings.collapse('toggle');
        }

        //Choose a chart type
        var ChartType = useHighStock ? Highcharts.StockChart : Highcharts.Chart;

        //Default highchart colors
        var colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
            '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
        var colorIndex = 0;

        var keys = [];

        //Set initial chart options
        var chartOptions;
        if (typeof options.chart === "undefined") {
            chartOptions = {renderTo: chartContainer.id};
        } else {
            chartOptions = $.extend(options["chart"], {renderTo: chartContainer.id});
        }

        //Initial rendered series
        var renderedSeries = [];
        var cachedSeries = [];
        options = $.extend(options, {chart: chartOptions}, {series: renderedSeries});
        var chart = new ChartType(options);
        editor.set(chart.options);

        selectorContainer.selectize({
            plugins: ['remove_button', 'restore_on_backspace'],
            delimiter: ',',
            options: [],
            onItemAdd: function (key) {
                console.log('series added');
                addSeries(key).done(function() {
                    newChart(chart.options, renderedSeries)
                });
            },
            onItemRemove: function (key) {
                console.log('series removed');
                deleteSeries(key);
                newChart(chart.options, renderedSeries);
            },
            onInitialize: update
        });

        var selector = selectorContainer[0].selectize;

            //Check for new keys
        function update() {
            $.get(path + '/keys.json').done(function (data) {
                //Get the new keys
                var oldKeys = keys.map(function (element) {
                    return element.name
                });

                //Get the new key objects
                var newKeys = data.filter(function (element) {
                    return oldKeys.indexOf(element.name) == -1
                });

                //Set the keys equal to all keys and update the selector
                keys = data;

                var showNewKeys = newKeys.filter(function(obj) {
                    return obj.display == true;
                });

                selector.addOption(keys);

                $.each(showNewKeys, function(index, obj) {
                    selector.addItem(obj.value)
                })
            })
        }

        function setOptions(options) {
            newChart(options, renderedSeries);
        }

        function findSeries(series, key) {
            return series.findIndex(function (obj) {
                return obj.name == key;
            })
        }

        function newChart(options, series) {
            //Disable animation
            var newOptions = $.extend(options, {series: series});
            newOptions.plotOptions['series'] = {animation: false};

            //Get zoom
            var xExtremes = chart.xAxis[0].getExtremes();

            //Re-plot the chart
            chart.destroy();
            chart = new ChartType(newOptions);

            //Reset the zoom
            chart.xAxis[0].setExtremes(xExtremes.min, xExtremes.max, false, false);

            //Re-draw chart
            chart.redraw();
        }

        function addSeries(key) {

            var index = findSeries(cachedSeries, key);
            if (index > -1) {
                var newSeries = cachedSeries[index];
                renderedSeries.push(newSeries);
                return $.when()
            } else {
                return $.get(path + '/' + key + '.json').done(function (data) {
                    if (key.color) {
                        data['color'] = key.color
                    } else {
                        data['color'] = colors[colorIndex % 10];
                        colorIndex = colorIndex + 1;
                    }

                    renderedSeries.push(data);
                    cachedSeries.push(data);
                    return null;
                });
            }
        }

        function deleteSeries(key) {
            var index = findSeries(renderedSeries, key);
            renderedSeries.splice(index, 1)
        }

        function saveSVG(url, name) {
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify({
                    svg: chart.getSVG(),
                    name: name
                })
            });
        }
    }
});

},{}]},{},[1]);
