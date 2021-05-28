
// dont under any circustance reuse or redeclare variable names in javascript , var is outdated only use let and const
// function ordering does not matter

// easier control flow
const { readdirSync, fstatSync, openSync, closeSync, readFileSync } = require('fs');
const Path = require('path');

// absloute path are use process.cwd and Path.join


function validSampleFiles(directory) {
    try {

        const _files = readdirSync(directory, { encoding: 'utf8' })

        _files.forEach(file => {

            const filepath = Path.join(directory, file);

            // open file and return file descriptor
            const fd = openSync(filepath, 'r');
            const filesize = fstatSync(fd);
            // close file desciptor. if file is closed before the other fd is closed the file descriptor will be reused
            closeSync(fd);

            //console.log(`file size: ${filesize['size']}`);

        })

        return _files.filter(value => {
            return value.indexOf('.lsp') !== -1
        }).map(value => {
            return Path.join(directory, value);
        });

    }
    catch (err) {
        console.error(`logged: ${err}`);
    }
}


function parsePacket(sample) {
    try {
        return JSON.parse(sample);
    }
    catch (err) {
        console.log(`logged: ${err}`);
        return null;
    }
}

function dynamicValidator(sampleObject) {
    // array of key 
    Object.entries(sampleObject)
}

function readValidSamples(sampleFile) {
    try {
        // samples are split by '\n' character. Beaware of OS newline differences '\n' , '\r\n'
        const samples = readFileSync(sampleFile).toString('utf-8').split('\n');

        // perform conversion  using callback per samples
        samples.slice(0, 2).forEach(sample => {
            const res = parsePacket(sample)

            if (res) {
                //dynamicValidator(res);
                console.log(Object.entries(res));
                //console.log(res.__proto__)
                //console.log(Object.getOwnPropertyNames(res))
            }

        });

    }
    catch (err) {
        console.log(`logged: ${err}`);
    }

}


const files = validSampleFiles('./supporting_scripts/packet_sample_data/');


readValidSamples(files[0]);


