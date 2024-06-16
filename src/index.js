import { io } from "socket.io-client";
import "../resources/style.css"
import Display from "./display";
import DataRecorder from "./data-record";


const content = document.getElementById('graphs');
const dataRecorders = [];

fetch('api/layout').then(r => { if (r.ok) return r.json() }).then(layout => {
    layout.forEach(element => {
        const dataRecorder = new DataRecorder("1", element, [])
        content.appendChild(dataRecorder.display.root);
        dataRecorders.push(dataRecorder)
    });


    var socket = io.connect('/sensor');

    socket.on('connect', function () {
        console.log('Connected to the WebSocket server');
    });

    socket.on('sensor_data', function (data) {
        const timestamp = new Date(data.time * 1000);

        for (const key in data.values) {
            const value = data.values[key].value;
            dataRecorders[layout.indexOf(key)].setPrecision(data.values[key].precision)
            dataRecorders[layout.indexOf(key)].addData([timestamp, value]);
            console.log(`${key}: ${value}`);
        }
    });


    function loadPastData(duration) {
        fetch('/api/past/' + duration).then(r => {
            if (r.ok) return r.json();
        }).then(pastData => {
            const x = pastData.data.map(e => new Date(e[0] * 1000));

            for (let index = 0; index < pastData.data.length - 2; index++) {
                dataRecorders[index].setData(pastData.data.map((e, i) => {
                    if(e[index + 1]) return[x[i], e[index + 1]]}))
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