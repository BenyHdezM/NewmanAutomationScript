// Linux / For windows use Powershell: $env:NODE_OPTIONS="--max-old-space-size=8192"
// export NODE_OPTIONS="--max-old-space-size=5120" #it will increase to 5gb
// export NODE_OPTIONS="--max-old-space-size=6144" #it will increase to 6gb
// export NODE_OPTIONS="--max-old-space-size=7168" #it will increase to 7gb
// export NODE_OPTIONS="--max-old-space-size=8192" #it will increase to 8gb

var newman = require('newman');
const path = require('path');
const fs = require('fs');
var numIteCount = 0;
var fileArg = process.argv.slice(2)[0];
if (process.argv.slice(3)) {
	numIteCount = parseInt(process.argv.slice(3)[0]);
}
runNewman(fileArg);
// fs.mkdir(path.join(__dirname, 'iterationLogs'), (err) => {
// 	if (err) {
// 		return console.log('Logs Directory Exist');
// 	}
// 	console.log('Logs Directory created successfully!');
// });
//joining path of directory 
const directoryPath = path.join(__dirname, 'iterations');
//passsing directoryPath and callback function
// fs.readdirSync(directoryPath).forEach(async file => {
// 	console.log("Runing File: " + file);
// 	runNewman(file);
// });

function runNewman(file) {
	if (fs.existsSync('./IterationLogs/Log' + file + '.txt')) {
		fs.unlink('./IterationLogs/Log' + file + '.txt', function (err) {
			if (err) return console.log(err);
		});
	}

	newman.run({
		collection: require('./Tariff.postman_collection.json'),
		iterationData: require('./iterations/' + file), //require('./iterations.json')
		insecure: true,
		iterationCount: numIteCount,
		reporters: 'cli'
	}, function (err, summary) {
		if (err) {
			throw err;
		}
		var exec = summary.run.executions;
		if (exec.length > 0) {
			for (i = 0; i < exec.length; i++) {
				let remoteJSON = JSON.stringify(JSON.parse(exec[i].response.stream));
				let localJSON = JSON.stringify(JSON.parse(exec[++i].response.stream));
				if (remoteJSON === localJSON) {
					var msj = 'Iteration: ' + exec[i].cursor.iteration + ' PASS\n';
					fs.appendFileSync('./IterationLogs/Log' + file + '.txt', msj);
					//console.log('Iteration: ', exec[i].cursor.iteration,' PASS');
				} else {
					var msj = 'Iteration: ' + exec[i].cursor.iteration + ' ERROR DIF...\n';
					fs.appendFileSync('./IterationLogs/Log' + file + '.txt', msj);
					//console.log('Iteration: ', exec[i].cursor.iteration,' ERROR DIF...');
				}
			}
		}
	});
};






