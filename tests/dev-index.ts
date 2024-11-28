import {Gantt2Editor} from "../src";
import "./main.css"


import {tasks2} from "./mock-data/data2";

const chart = new Gantt2Editor(document.getElementById('chart') as HTMLElement);
chart.init(tasks2,{
    // showTaskNames: true,
    taskStrokeWidth: 1,
    taskHeight: 20,
    taskDayWidth: 50,
    taskVPadding: 10,
    addTaskTitles: true,
    taskBorderRadius: 0,
    showGrid: true,
    showLegends: true,
    // weekEnds: [0]
    dependencyOpacity: .4,
    dependencyStrokeWidth: 2,
    dependencyArrowSize: 12,
    timelineLegendHeight: 60,
    // timelineDayNumbersForWeekdays: [1],
    // timelineDayNumbersForMonthDates: [1, 15]
});

