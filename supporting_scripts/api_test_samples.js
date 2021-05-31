const { readdir, readFile, readLine } = require('fs');
const Path = require('path');

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

            resolve(files);
        })
    });
}

async function loadSamples(validFiles) {

    console.log(validFiles);
    // return new Promise((resolve, reject) => {

    // });
}

async function getValidSamples(files) {
    // could fail no vaild sample files
    return new Promise((resolve, reject) => {
        const validFiles = files.filter((value) => value.indexOf('lsp') >= 0);
        if (validFiles.length == 0) {
            reject('no valid sample files')
            return;
        }

        resolve(validFiles);
    });

}

const filesPromise = getFiles('./supporting_scripts/packet_sample_data/');

filesPromise
    .then(getValidSamples, Failure)
    .then(loadSamples, Failure)
    // handle throw part
    .catch((reason) => { console.log(reason) });
