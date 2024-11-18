import {ParsedData, Utils, SVGElementWrapper, Task} from "gantt2";
import {Config} from "../config/config";

export class TaskNames {
    private readonly elem: SVGElementWrapper;
    private readonly container: HTMLDivElement;
    constructor(data: ParsedData, height: number) {
        this.container = document.createElement('div');
        this.container.classList.add('gantt-editor-task-names-container');
        this.elem = Utils.createElement('svg');
        this.elem.setAttrib_('height', String(height))
            .setAttrib_('width', '300');
        this.elem.element.style.overflow = "auto";
        this.container.appendChild(this.elem.element);
    }

    getElement() {
        return this.container;
    }

    init(tasks: Task[], conf: Config) {
        const dummyElement = document.createElement('div');
        dummyElement.style.height = conf.timelineLegendHeight + 'px';
        this.container.prepend(dummyElement);
        this.buildNames(tasks, conf)
    }

    private buildNames(tasks: Task[], conf: Config) {
        let taskNumber = 0;
        const self = this;
        function buildNames_ (tasks: Task[], level: number) {
            for (const t of tasks) {
                const el = Utils.createElement('text')
                    .setAttrib_('y', String(conf.taskVPadding + conf.taskHeight + taskNumber * (conf.taskHeight + conf.taskVPadding * 2)))
                    .setAttrib_('x', String(level * 20 + 5));
                ++taskNumber;
                el.element.innerHTML = (t.tasks.length ? "⌄&nbsp;" : "&nbsp;&nbsp;") + t.name;
                self.elem.appChild_(el);
                if (t.tasks.length) {
                    buildNames_(t.tasks as Task[], level + 1);
                }
            }
        }
        buildNames_(tasks, 0);
    }
}
