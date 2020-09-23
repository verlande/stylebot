export default class CronOptions {

    id: String;
    cronTime: String = '';
    onTick: Function = () => {};
    onComplete: Function = null;
    start: Boolean = false;
    timezone: String = 'GMT';
    context: any;
    runOnInit: Boolean = false;

}
