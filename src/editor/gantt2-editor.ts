import {ConfigParser, IConfig} from "../config/config";
import {Gantt2, ITask} from "gantt2";
import {TaskNames} from "./task-names";

export class Gantt2Editor {
    private gantt2?: Gantt2;
    constructor(private elem: HTMLElement) {
        this.elem.style.display = 'flex';
        this.elem.style.height = '400px';
    }

    init(data: ITask[], config?: IConfig) {
        const parsedConfig = ConfigParser.parse(config);
        const gantt2Elem = window.document.createElement('div');
        gantt2Elem.setAttribute('style', 'display: inline-block;');
        this.elem.appendChild(gantt2Elem);
        this.gantt2 = new Gantt2(gantt2Elem);
        const parsedData = this.gantt2.init(data, parsedConfig);
        const names = new TaskNames(parsedData, this.gantt2.getTotalHeight());
        this.elem.prepend(names.getElement());
        names.init(parsedData.tasks, parsedConfig)
    }


}
