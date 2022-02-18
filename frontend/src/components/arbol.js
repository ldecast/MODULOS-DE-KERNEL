import React from "react";
import { clientcpu } from "./cpu";

export class Arbol extends React.Component {
    client = clientcpu
    state = {
        cpuData: { Processes: [], Running: 0, Sleeping: 0, Zombie: 0, Stopped: 0, Total: 0, Usage: 0 },
    }

    componentDidMount() {
        this.client.onopen = (event) => {
            console.log("cpu websocket connected")
        }
        this.client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data)
            console.log("cpu arbol", dataFromServer)
            this.setState({ cpuData: dataFromServer })
        }
    }

    render() {
        return (
            <div>
                <div className="accordion" id="accordionRoot">
                    {this.state.cpuData.Processes.map(
                        element =>
                        <div className="accordion-item" key={element.Pid}>
                            <h2 className="accordion-header" id={element.Pid}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={this.addId(element.Pid, false)} aria-expanded="false" aria-controls={this.addId(element.Pid,true)}>
                                    {element.Pid} - {element.Name}
                                </button>
                            </h2>
                            <div id={this.addId(element.Pid, true)} className="accordion-collapse collapse hide" aria-labelledby={element.Pid} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    {element.Child.map(
                                        ele=>
                                        <p key={ele.Pid}>{ele.Pid} - {ele.Name}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    addId(id, trigger) {
        var auxiliar = id.toString()
        if(trigger){
            auxiliar = "c"+auxiliar
        }else{
            auxiliar = "#c"+auxiliar
        }
        return auxiliar
    }
}