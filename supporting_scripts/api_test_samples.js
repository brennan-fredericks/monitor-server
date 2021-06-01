
const { once } = require('events');
const { readdir, createReadStream } = require('fs');
//const fetch = require('node-fetch');
const axios = require('axios');
const Path = require('path');
const { createInterface } = require('readline');
const { PacketValidator } = require('./protocol_schema_validation')

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

            try {
                const filepaths = files.map((value) => {
                    return Path.join(directory, value);
                });

                resolve(filepaths);
            }
            catch (ex) {
                // Path.join can throw exception for invalid arguments
                reject(`${ex}`);
            }

        });
    });
}

async function _parseToObject(sample_string) {
    try {

        return JSON.parse(sample_string)
    }
    catch (err) {
        console.error(`${err}`);
        return null;
    }
}

async function _validatePacket(packet) {

    // check overall structure
    if (!PacketValidator.get('Packet')(packet)) return false;

    // check that the key and values are valid, skip unknown keys
    for (const [k, v] of Object.entries(packet)) {

        //console.log(typeof PacketValidator);
        if (PacketValidator.has(k)) {

            // stop validating packet if invalid data is found 
            if (!PacketValidator.get(k)(v)) return false;
        }
        else {
            //packet has additional keys, do nothing for now
            console.warn(`contained addiotional data which was not processed ${k}, ${v}`);
        }
    }

    // packet has valid data
    return true;
}

async function _postPacketData(pdata) {

    return axios({
        method: 'POST',
        url: 'packets',
        baseUrl: 'localhost',
        port: 3000,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(pdata)
    })


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

            // try to convert string to object
            const packet = await _parseToObject(sample);

            if (packet) {
                // able to parse string to JSON

                const valid = await _validatePacket(packet);

                if (valid) {
                    // post data to server
                    _postPacketData(packet).then(response_data => console.log(response_data)).catch((reason) => {
                        console.error(`${reason}`);
                    });
                }
                else {
                    console.warn(`Invalid packet ${packet}`);
                }
                //console.info(PacketValidator.validatePacket(packet));
                // validate contents
                //const valid 
            }

        });

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
        validFiles.slice(0, 1).forEach(_loadSample)
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
