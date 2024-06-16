const { default: Display } = require("./display");

export default class DataRecorder {
    constructor(name, type, data = []) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.display = new Display();
        this.display.setUnit(type);
    }

    addData(newData) {
        this.data.push(newData)
        if (this.data.length > 120) this.data.shift();
        this.display.data = this.data;
        this.display.setValue(newData[1])
        this.display.update();
    }

    setData(newData) {
        this.data = newData;
        this.display.data = this.data;
        this.display.setValue(newData[newData.length - 1][1])
        this.display.update();
    }

    setPrecision(precision) {
        this.display.precision = precision;
    }

    getPrecision() {
        return this.display.precision;
    }
}