import {ConfigParser, IConfig} from "../config/config";
import {Gantt2, ITask} from "gantt2";
import {TaskNames} from "./task-names";

const template = `
<style>
    resizeable-boxes {
        height: 100%;
    }
    div[slot] {
        height: 100%;
    }
</style>
<resizeable-boxes>
<div slot="content-container-1"></div>
<div slot="content-container-2"></div>
</resizeable-boxes>`;

export class Gantt2Editor {
    private gantt2?: Gantt2;
    constructor(private elem: HTMLElement) {
        this.elem.innerHTML = template;
    }

    init(data: ITask[], config?: IConfig) {
        const parsedConfig = ConfigParser.parse(config);
        const gantt2Elem = this.elem.querySelector('[slot="content-container-2"]') as HTMLDivElement;
        this.gantt2 = new Gantt2(gantt2Elem);
        const parsedData = this.gantt2.init(data, parsedConfig);

        const namesContainer = this.elem.querySelector('[slot="content-container-1"]') as HTMLDivElement;

        const names = new TaskNames(namesContainer, parsedData, this.gantt2.getTotalHeight());
        names.init(parsedData.tasks, parsedConfig);
        names.scrollChanged = (scrollTop) => {
            this.gantt2?.setChartScroll(scrollTop);
        };
        this.gantt2.setChartScrollEventHandler(names.scrollEventHandler);
    }
}
