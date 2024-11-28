import {ConfigParser, IConfig} from "../config/config";
import {Gantt2, ITask} from "gantt2";
import {TaskNames} from "./task-names";

const template = `
<style>
    resizable-boxes {
        height: 100%;
    }
    div[class^="content-container-"] {
        height: 100%;
    }
</style>
<resizable-boxes>
    <div class="content-container-1"></div>
    <div class="content-container-2" size-ratio="2"></div>
</resizable-boxes>`;

export class Gantt2Editor {
    private gantt2?: Gantt2;
    constructor(private elem: HTMLElement) {
        this.elem.innerHTML = template;
    }

    init(data: ITask[], config?: IConfig) {
        const parsedConfig = ConfigParser.parse(config);
        const gantt2Elem = this.elem.querySelector('.content-container-2') as HTMLDivElement;
        this.gantt2 = new Gantt2(gantt2Elem);
        const parsedData = this.gantt2.init(data, parsedConfig);

        const namesContainer = this.elem.querySelector('.content-container-1') as HTMLDivElement;

        const names = new TaskNames(namesContainer, this.gantt2.getTotalHeight());
        names.init(parsedData.tasks, parsedConfig);
        names.scrollChanged = (scrollTop) => {
            this.gantt2?.setChartScroll(scrollTop);
        };
        this.gantt2.setChartScrollEventHandler(names.scrollEventHandler);
    }
}
