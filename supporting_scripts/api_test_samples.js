const { once } = require('events');
const { readdir, readFile, readLine, createReadStream } = require('fs');
const Path = require('path');
const { createInterface } = require('readline');

function Failure(msg) {
    //console.error(`Failure Callback: ${msg}`);
    throw new Error(`Execution chain stopped:\n\t ${msg}`);
}

async function getFiles(directory) {
    // could fail invalid directory
    return new Promise((resolve, reject) => {
        readdir(directory, 'utf8', (err, files) => {
            if (err) {

                reject(`${err}`);
                return;
            }

            // create file path
            resolve(files.map((value) => {
                return Path.join(directory, value);
            }));

        })
    });
}

async function parseToObject(sample_string) {
    try {

        return JSON.parse(sample_string)
    }
    catch (err) {
        console.error(`${err}`);
        return null;
    }
}

async function _loadSample(validFile) {
    // avoid load large files into memory before processing 

    try {
        const rl = createInterface({
            input: createReadStream(validFile),
            crlfDelay: Infinity,
        });

        // register for on line event
        rl.on('line', async (sample) => {
            const packet = await parseToObject(sample);

            if (packet) {
                // able to parse string to JSON
                console.info(packet);
                // validate contents
                //const valid 
            }


        })

        // wait until we receive the file close event
        await once(rl, 'close');
    }
    catch (err) {
        console.error(`${err}`);
    }
}

async function loadSamples(validFiles) {
    // some files or samples in files could be invalid JSON,
    // allow application to continue to the next line

    return new Promise((resolve, reject) => {
        validFiles.forEach(_loadSample)
        resolve('done loading samples');
    });

}

async function getValidSamples(files) {
    // could fail no vaild sample files
    return new Promise((resolve, reject) => {
        const validFiles = files.filter((value) => value.indexOf('lsp') >= 0);

        if (validFiles.length == 0) {
            reject('No valid sample files in the directory provided')
            return;
        }

        resolve(validFiles);
    });

}

const filesPromise = getFiles('./supporting_scripts/packet_sample_data/');

filesPromise
    .then(getValidSamples, Failure)
    .then(getValidSamples, Failure)
    .then(loadSamples, Failure)
    // handle error raised by Failure 
    .catch((reason) => { console.log(reason) });
