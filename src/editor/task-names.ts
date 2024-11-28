import {ParsedData, SVGElementWrapper, Task, Utils} from "gantt2";
import {Config} from "../config/config";

export class TaskNames {
    private readonly elem: SVGElementWrapper;
    private readonly scroller: HTMLDivElement;
    private touchPrevY: number = -1;
    constructor(private readonly container: HTMLDivElement, data: ParsedData, height: number) {
        this.container.classList.add('gantt-editor-task-names-container');
        this.scroller = document.createElement('div');
        this.scroller.style.overflowX = 'auto';
        this.scroller.style.overflowY = 'hidden';
        this.container.appendChild(this.scroller);
        this.elem = Utils.createElement('svg');
        this.elem.setAttrib_('height', String(height));
        this.scroller.appendChild(this.elem.element);
        this.scroller.addEventListener('mousewheel', (evt) => {
            const wEvent = evt as WheelEvent;
            this.scroller.scrollTop += wEvent.deltaY / 2;
            if (this.scrollChanged) {
                this.scrollChanged(this.scroller.scrollTop)
            }
        });

        this.scroller.addEventListener('touchstart', (evt) => {
            const tEvent = evt as TouchEvent;
            this.touchPrevY = tEvent.touches[0].pageY;
            const touchMoveHandler = (evt: TouchEvent) => {
                const deltaY = this.touchPrevY - evt.touches[0].pageY;
                this.touchPrevY = evt.touches[0].pageY;
                this.scroller.scrollBy({top: deltaY});
                if (this.scrollChanged) {
                    this.scrollChanged(this.scroller.scrollTop)
                }
            };
            const touchEndHandler = () => {
                this.scroller.removeEventListener('touchmove', touchMoveHandler);
                this.scroller.removeEventListener('touchend', touchEndHandler);

            };
            this.scroller.addEventListener('touchmove', touchMoveHandler);
            this.scroller.addEventListener('touchend', touchEndHandler);
        });
    }

    public scrollChanged?: (scrollTop: number) => void;

    scrollEventHandler = (evt: Event) => {
        this.scroller.scrollTop = (evt.target as HTMLDivElement).scrollTop;
    };

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
