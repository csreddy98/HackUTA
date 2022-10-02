// import json file from data.json

const fs = require('fs');

let data = fs.readFileSync('database/data.json').toString();
data = JSON.parse(data);
// add new data to data.json
const addData = (attr, newData) => {
    data[attr].push(newData);
    fs.writeFileSync('database/data.json', JSON.stringify(data));
    return true;
}

// get data from data.json
const getData = (attr) => {
    return data[attr];
}

module.exports = {
    addData,
    getData
};