const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

async function runPwsh (scriptPath, argsObject) {

    // pwsh -File setup.ps1 -name "David Boike" -testInput "Second banana"
    let pwshArgs = ['-File', scriptPath];

    if (argsObject) {
        let keys = Object.getOwnPropertyNames(argsObject);
        keys.forEach(key => {
            pwshArgs.push('-' + key);
            pwshArgs.push('"' + argsObject[key] + '"');
        });
    }

    let pwsh = spawn('pwsh', pwshArgs);

    pwsh.stdout.setEncoding('utf8');
    let outReader = readline.createInterface({ input: pwsh.stdout });
    outReader.on('line', (line) => {
        console.log(line);
    });

    pwsh.stderr.setEncoding('utf8');
    let errReader = readline.createInterface({ input: pwsh.stderr });
    errReader.on('line', (line) => {
        console.error(line);
    });

    pwsh.stdin.end();

    const exitCode = await new Promise( (resolve, reject) => {
        pwsh.on('close', resolve);
    });

    console.log('Exit code: ' + exitCode);
    if (exitCode) {
        throw new Error(`pwsh exited with code ${exitCode}`);
    }
}

module.exports = runPwsh;
