const { exec } = require("child_process");
const path = require('path');
const fs = require('fs');
var numIteCount = null;

if (process.argv.slice(2)) {
    numIteCount = parseInt(process.argv.slice(2)[0]);
}

fs.mkdir(path.join(__dirname, 'iterationLogs'), (err) => {
    if (err) {
        return console.log('Logs Directory Exist');
    }
    console.log('Logs Directory created successfully!');
});


const directoryPath = path.join(__dirname, 'iterations');
//passsing directoryPath and callback function
fs.readdirSync(directoryPath).forEach(async file => {
    console.log("Runing File: " + file);
    execute(file);
});



function execute(file) {
    // var command = "newman run Tariff.postman_collection.json";
    // command += " --insecure";
    // command += " -d ./iterations/" + file;
    // command += " --reporters cli";
    // command += ' -n 2';
    var child = exec('node run_newman.js ' + file + ' ' + numIteCount);
    child.stdout.on('data', function (data) {
        process.stdout.write(data);
    });
    child.stderr.on('data', function (data) {
        process.stderr.write(data);
    });
    child.on('close', summarizeTestResults)


    function summarizeTestResults() {

    }


}

