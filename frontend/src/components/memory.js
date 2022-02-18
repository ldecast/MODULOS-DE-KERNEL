import React from 'react'
import { Chart } from 'react-google-charts'

const clientram = new WebSocket('ws://localhost:4200/ram')
export class Memory extends React.Component {
    client = clientram
    state = {
        data: [['x', 'Memoria RAM'], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0]],
        memoria: { Total_memory: 0, Free_memory: 0, Used_memory: 0, Available_memory: 0 ,MB_memory:0}
    }

    componentDidMount() {
        this.client.onopen = (event) => {
            console.log("memory websocket connected");
        }
        this.client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log("ram", dataFromServer)
            this.fillData()
            this.setState({ memoria: dataFromServer })

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
                        Memoria total: {this.state.memoria.Total_memory}
                    </p>
                    <p>
                        Memoria libre: {this.state.memoria.Free_memory}
                    </p>
                    <p>
                        Memoria disponible: {this.state.memoria.Available_memory}
                    </p>
                    <p>
                        Memoria en uso: {this.state.memoria.MB_memory}
                    </p>
                    <p>
                        Uso de memoria: {this.state.memoria.Used_memory}%
                    </p>
                </div>
            </div>
        )
    }

    fillData() {
        var encabezado = ['x', 'Memoria RAM']
        var inputData = [Number(this.state.data[15][0]) + 1, this.state.memoria.Used_memory]
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
}