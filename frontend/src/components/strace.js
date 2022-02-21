import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { PidStrace } from '../history/history'
import './css/strace.css';
import Histograma from './histograma';

function Strace() {

    const [data, setData] = useState([['x', 'Memoria RAM'], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0]]);
    const [straceData, setStraceData] = useState({ Processes: [], Running: 0, Sleeping: 0, Zombie: 0, Stopped: 0, Total: 0, Usage: 0 });
    const [response, setResponse] = useState({ Name: "...", Pid: 0, List: [{ Recurrence: 0, Name: "_" }] });

    const _pathname = useLocation().pathname;
    const _pid = _pathname.substring(_pathname.lastIndexOf('/') + 1);
    let client;

    useEffect(() => {
        const getStraceData = () => {
            // console.log(_pid)
            const clientstrace = new WebSocket('ws://localhost:4200/strace/' + _pid);
            client = clientstrace;
        }
        getStraceData();
        client.onopen = (event) => {
            console.log("strace websocket connected");
        }
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log("strace", dataFromServer);
            setResponse(dataFromServer);
            // setData(dataFromServer)
            // setStraceData(dataFromServer)
        }
    }, [])

    return (
        <div>
            <h2>Ejecutando comando strace para PID: {_pid}</h2>
            <hr />
            <div className="header-strace">
                <p></p>
                <p>PID: {response.Pid}</p>
                <p>|</p>
                <p>Name: {response.Name}</p>
                <p></p>
            </div>
            <div className='table-strace'>
                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Recurrence</th>
                            <th scope="col">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            response.List.map((rp, i) => {
                                return (<tr>
                                    <th scope="row">{i + 1}</th>
                                    <td>{rp.Recurrence}</td>
                                    <td>{rp.Name}</td>
                                </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className='histogram-container'>
                <div className='names-histogram'>
                    {
                        response.List.map((rp, i) => {
                            return (
                                <p>{i + 1}) {rp.Name}</p>
                            )
                        })
                    }
                </div>
                <div className="strace-histogram">
                    <Histograma
                        list={response.List}
                        key={Math.random()}
                    />
                </div>
            </div>
        </div>
    );
}

export default Strace;