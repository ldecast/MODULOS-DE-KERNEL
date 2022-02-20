import React from 'react'
import { Chart } from 'react-google-charts'
import { PidStrace } from '../history/history'

// export const clientstrace = new WebSocket('ws://localhost:4200/strace/' + pidStrace)// agregar el pid
export class Strace extends React.Component {
    state = {
        data: [['x', 'Memoria RAM'], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0]],
        straceData: { Processes: [], Running: 0, Sleeping: 0, Zombie: 0, Stopped: 0, Total: 0, Usage: 0 },
        pid:""
    }
    componentDidMount(){
        console.log(PidStrace.getPid())
        PidStrace.setPid(1234)
        console.log(PidStrace.getPid())
    }
    render() {
        return (
            <div>
                <p>buenas tardes</p>
            </div>
        )
    }
}