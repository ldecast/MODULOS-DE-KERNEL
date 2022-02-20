import { createBrowserHistory } from 'history'

export default createBrowserHistory();

export class PidStrace {

    static pidStrace = 123

    static setPid = function (pid) {
        PidStrace.pidStrace = pid
    }
    static getPid = function () {
        return PidStrace.pidStrace
    }
}


