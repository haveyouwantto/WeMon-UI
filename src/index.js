import { io } from "socket.io-client";
import "../resources/style.css"
import DataRecorder from "./data-record";


const content = document.getElementById('graphs');
const dataRecorders = {};

fetch('api/last').then(r => { if (r.ok) return r.json() }).then(layout => {

    for (const unit in layout.values) {
        const element = layout.values[unit];
        const dataRecorder = new DataRecorder("1", unit, [])
        dataRecorder.display.precision = element.precision;
        dataRecorder.display.setValue(element.value);
        content.appendChild(dataRecorder.display.root);
        dataRecorders[unit] = dataRecorder;
    }

    var socket = io.connect('/sensor');

    socket.on('connect', function () {
        console.log('Connected to the WebSocket server');
    });

    // on data from the server
    socket.on('sensor_data', function (data) {
        const timestamp = new Date(data.time * 1000);

        for (const key in data.values) {
            const value = data.values[key].value;
            dataRecorders[key].setPrecision(data.values[key].precision)
            dataRecorders[key].addData([timestamp, value]);
            console.log(`${key}: ${value}`);
        }
    });


    function loadPastData(duration) {
        fetch('/api/past/' + duration).then(r => {
            if (r.ok) return r.json();
        }).then(pastData => {
            const x = pastData.data.timestamp.map(e => e * 1000); // convert to milliseconds

            for (const key in dataRecorders) {
                dataRecorders[key].setData(x.map((e, i) => {
                    return [e, pastData.data[key][i]] // pack the data into an array of [timestamp, value] pairs
                }))
            }
        })
    }

    loadPastData(120);


    const timeScaleSelector = document.getElementById('timeScale')

    timeScaleSelector.addEventListener('change', e => {
        const timeScale = parseInt(timeScaleSelector.value);
        loadPastData(timeScale);
    })
})