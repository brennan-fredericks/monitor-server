const { readdir, readFile, readLine } = require('fs');
const Path = require('path');


async function getValidSampleFiles(directory) {

    return new Promise((resolve, reject) => {
        readdir(directory, 'utf8', (err, files) => {
            if (err) {
                reject(`${err}`);
            }

            const res = files.filter((value) => value.indexOf('lsp') >= 0);

            resolve(res);

        })
    });
}


const filesPromise = getValidSampleFiles('./supporting_scripts/packet_sample_data/');

filesPromise.then((files) => {
    console.log(files);
})
