import React from 'react'
import { Chart } from 'react-google-charts'

export const clientcpu = new WebSocket('ws://localhost:4200/cpu')
export class Cpu extends React.Component {
    client = clientcpu
    state = {
        data: [['x', 'Memoria RAM'], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0]],
        cpuData: { Processes: [], Running: 0, Sleeping: 0, Zombie: 0, Stopped: 0, Total: 0, Usage: 0 }
    }

    componentDidMount() {
        this.client.onopen = (event) => {
            console.log("memory websocket connected");
        }
        this.client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log("cpu", dataFromServer)
            this.fillData()
            this.setState({ cpuData: dataFromServer })
        }
    }

    render() {
        return (
            <div className='row'>
                <div className='col'>

                    <Chart
                        width={'1500px'}
                        height={'1000px'}
                        chartType="LineChart"
                        loader={<div>Loading Chart</div>}
                        data={this.state.data}
                        options={{
                            title: ' ',
                            backgroundColor: 'transparent',
                            hAxis: {
                                title: 'Tiempo',
                                textPosition: 'none'
                            },
                            vAxis: {
                                title: 'Uso',
                                minValue: 0,
                                maxValue: 100
                            },
                        }}

                        rootProps={{ 'data-testid': '1' }}
                    />
                </div>
                <div className='col'>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <p>
                        Running: {this.state.cpuData.Running}
                    </p>
                    <p>
                        Sleeping: {this.state.cpuData.Sleeping}
                    </p>
                    <p>
                        Zombie: {this.state.cpuData.Zombie}
                    </p>
                    <p>
                        Stopped: {this.state.cpuData.Stopped}
                    </p>
                    <p>
                        Total: {this.state.cpuData.Total}
                    </p>
                    <p>
                        Usage: {this.getUsage()}
                    </p>
                </div>
                <h1>Procesos</h1>
            <br />
            <div className='row'>
                <div className="col">Running: {this.state.cpuData.Running}</div>
                <div className="col">Sleeping: {this.state.cpuData.Sleeping}</div>
                <div className="col">Zombie: {this.state.cpuData.Zombie}</div>
                <div className="col">Stopped: {this.state.cpuData.Stopped}</div>
                <div className="col">Total: {this.state.cpuData.Total}</div>
                <div className="col">Usage: {this.getUsage()}</div>
            </div>
            <br />
            <table className="table table-striped table-hover table-light">
                <thead>
                    <tr>
                        <th scope='col'>PID</th>
                        <th scope='col'>Name</th>
                        <th scope='col'>User</th>
                        <th scope='col'>State</th>
                        <th scope='col'>RAM</th>
                        <th scope='col'>Kill</th>
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                    {this.state.cpuData.Processes.map(
                        element =>
                            <tr key={element.Pid}>
                                <td>{element.Pid}</td>
                                <td>{element.Name}</td>
                                <td>{element.User}</td>
                                <td>{element.State}</td>
                                <td>{element.Ram}</td>
                                <td><button className='btn btn-danger' onClick={()=>this.killProcess(element.Pid)}>KILL</button></td>
                            </tr>
                    )}
                </tbody>
            </table>
            </div>
        )
    }

    getUsage(){
        return Math.round(this.state.cpuData.Usage*100)/100
    }

    fillData() {
        var encabezado = ['x', 'Uso CPU']
        var inputData = [Number(this.state.data[15][0]) + 1, this.state.cpuData.Usage]
        console.log(this.state.data[7])
        var datos = []
        datos.push(encabezado)
        for (let i = 0; i < 15; i++) {
            if (this.state.data[i + 2]) {
                datos.push(this.state.data[i + 2])
            }
        }
        datos.push(inputData)
        this.setState({ data: datos })
    }

    killProcess(pid){
     fetch("http://localhost:4200/kill",{
         method:'POST',
         headers: { 'Content-Type': 'application/json' },
         body: pid
     }).then(async response =>{
         const json =await response.json()
        if (json.value != false){
            // tengo que poner el verdadero
        }else{
            // tengo que poner el falso
        }
     })   
    }
}