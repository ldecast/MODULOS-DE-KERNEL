var React = require('react');
var Component = React.Component;
var CanvasJSReact = require('canvasjs-react-charts');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Histograma extends Component {

    constructor() {
        super();
        this.state = {
            dataPoints: []
        };
    }

    componentDidMount() {
        const list = this.props.list;
        if (list) {
            let points = [];
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                points.push({
                    x: i + 1,
                    y: item.Recurrence
                });
            }
            this.setState({
                dataPoints: points
            });
        }
    }

    render() {
        const options = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "dark1", // "light1", "dark1", "dark2"
            title: {
                text: "Histogram"
            },
            axisY: {
                title: "Recurrence",
                suffix: ""
            },
            axisX: {
                title: "Process",
                prefix: "",
                interval: 1
            },
            data: [{
                type: "line",
                toolTipContent: "Recurrencia: {y}",
                dataPoints: this.state.dataPoints
            }]
        }
        return (
            <div>
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default Histograma;