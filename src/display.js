import units from "./units";

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    ToolboxComponent,
    DataZoomComponent,
    MarkLineComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    ToolboxComponent,
    DataZoomComponent,
    MarkLineComponent
]);

const labelColor = "rgb(192,192,192)";
const gridColor = "rgb(128,128,128)";

export default class Display {
    constructor() {
        this.root = document.createElement('div');
        this.graph = document.createElement('div');
        this.graph.classList.add('graph')
        this.canvas = document.createElement('div');
        this.canvas.classList.add('graph-container')

        this.element = document.createElement('div');
        this.element.classList.add('numeric-display');
        this.nameLabel = document.createElement('span');
        this.nameLabel.classList.add('unit-name');
        this.intPart = document.createElement('span')
        this.intPart.classList.add('int-part')
        this.decimalPart = document.createElement('span')
        this.decimalPart.classList.add('decimal-part')
        this.unitLabel = document.createElement('span')
        this.unitLabel.classList.add('unit-label')

        this.element.appendChild(this.nameLabel);
        this.element.appendChild(this.intPart);
        this.element.appendChild(this.decimalPart);
        this.element.appendChild(this.unitLabel);

        this.graph.appendChild(this.canvas);
        this.root.appendChild(this.graph);
        this.root.appendChild(this.element)

        this.precision = 2;

        this.initChart();
    }

    initChart() {
        this.chart = echarts.init(this.canvas);
        var options = {
            tooltip: {
                trigger: 'axis',
                valueFormatter: v => v && v.toFixed(this.precision),
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                right: 56,
                left: 56
            },
            xAxis: {
                type: 'time',
                data: [], // Update with your data
                axisLabel: {
                    rotate: 0
                },
                axisLine: {
                    lineStyle: {
                        color: labelColor // Define label color
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: gridColor // Define grid color
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
                axisLine: {
                    lineStyle: {
                        color: labelColor // Define label color
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: gridColor // Define grid color
                    }
                }
            },
            series: [
                {
                    type: 'line',
                    showSymbol: false,
                    sampling: 'lttb',
                    itemStyle: {
                        color: "#4caf50"
                    },
                    data: [], // Update with your data
                    smooth: true,
                    markLine: {
                        data: [
                            { type: 'average', name: 'Avg' },
                            [
                                {
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                },
                                {
                                    symbol: 'circle',
                                    label: {
                                        position: 'start'
                                    },
                                    type: 'max'
                                }
                            ],
                            [
                                {
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'min'
                                },
                                {
                                    symbol: 'circle',
                                    label: {
                                        position: 'start'
                                    },
                                    type: 'min'
                                }
                            ]],
                        label:
                        {
                            formatter: v => v && v.value.toFixed(this.precision),
                            color: "#ffffff"
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                    minValueSpan: 300 * 1000
                },
                {
                    start: 0,
                    end: 10,
                    minValueSpan: 300 * 1000
                }
            ],
        };

        this.chart.setOption(options)
        window.addEventListener('resize', () => {
            console.log(this.chart)
            this.chart.resize();
        });
    }

    setUnit(name) {
        this.unit = units[name];
        this.nameLabel.innerText = units[name].name;
        this.unitLabel.innerText = units[name].unit;

        this.chart.setOption({
            series: [{
                name: units[name].name
            }]
        });
    }

    setValue(value) {
        let parts = value.toFixed(this.precision).split('.')
        this.intPart.innerText = parts[0];
        if(parts.length <= 1)
            this.decimalPart.innerText = '';
        else
            this.decimalPart.innerText = '.' + parts[1];
    }

    get data() {
        return this.chart.getOption().series[0].data;
    }

    set data(data) {
        this.chart.setOption({
            series: [{
                data: data
            }]
        });
    }

    update() {
        this.chart.resize();
    }
}