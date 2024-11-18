import {ConfigParser as Gantt2ConfigParser, IConfig as Gantt2IConfig} from "gantt2/prod";

export interface IConfig extends Gantt2IConfig{
    taskNamesSide?: 'left' | 'right' | 'none'
}

export type Config = {[key in keyof IConfig]-? : IConfig[key]}


export class ConfigParser {
    static parse(cfg?: IConfig): Config {
        return {
            ...(Gantt2ConfigParser.parse(cfg)),
            taskNamesSide: cfg?.taskNamesSide || 'left',
            showTaskNames: cfg?.showTaskNames ?? false,
        }
    }
}
