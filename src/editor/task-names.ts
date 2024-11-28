import {SVGElementWrapper, Task, Utils} from "gantt2";
import {Config} from "../config/config";

export class TaskNames {
    private readonly _elem: SVGElementWrapper;
    private readonly _scroller: HTMLDivElement;
    private _touchPrevY: number = -1;
    constructor(private readonly _container: HTMLDivElement, height: number) {
        this._container.classList.add('gantt-editor-task-names-container');
        this._scroller = document.createElement('div');
        this._scroller.style.overflowX = 'auto';
        this._scroller.style.overflowY = 'hidden';
        this._container.appendChild(this._scroller);
        this._elem = Utils.createElement('svg');
        this._elem.setAttrib_('height', String(height));
        this._scroller.appendChild(this._elem.element);
        this._scroller.addEventListener('mousewheel', (evt) => {
            const wEvent = evt as WheelEvent;
            this._scroller.scrollTop += wEvent.deltaY / 2;
            if (this.scrollChanged) {
                this.scrollChanged(this._scroller.scrollTop)
            }
        });

        this._scroller.addEventListener('touchstart', (evt) => {
            const tEvent = evt as TouchEvent;
            this._touchPrevY = tEvent.touches[0].pageY;
            const touchMoveHandler = (evt: TouchEvent) => {
                const deltaY = this._touchPrevY - evt.touches[0].pageY;
                this._touchPrevY = evt.touches[0].pageY;
                this._scroller.scrollBy({top: deltaY});
                if (this.scrollChanged) {
                    this.scrollChanged(this._scroller.scrollTop)
                }
            };
            const touchEndHandler = () => {
                this._scroller.removeEventListener('touchmove', touchMoveHandler);
                this._scroller.removeEventListener('touchend', touchEndHandler);

            };
            this._scroller.addEventListener('touchmove', touchMoveHandler);
            this._scroller.addEventListener('touchend', touchEndHandler);
        });
    }

    scrollChanged?: (scrollTop: number) => void;

    scrollEventHandler = (evt: Event) => {
        this._scroller.scrollTop = (evt.target as HTMLDivElement).scrollTop;
    };

    getElement() {
        return this._container;
    }

    init(tasks: Task[], conf: Config) {
        const dummyElement = document.createElement('div');
        dummyElement.style.height = conf.timelineLegendHeight + 'px';
        this._container.prepend(dummyElement);
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
                self._elem.appChild_(el);
                if (t.tasks.length) {
                    buildNames_(t.tasks as Task[], level + 1);
                }
            }
        }
        buildNames_(tasks, 0);
    }
}
