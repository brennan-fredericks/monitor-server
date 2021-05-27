const fs = require('fs');

// read directory Sync

function readExDirectory(dir) {

    let files;

    try {
        files = fs.readdirSync(dir);
        if (files.length == 0) {
            //console.warn(`No files available in directory ${dir}`);
            throw new Error(`No files available in directory ${dir}`)
        }
    }
    catch (err) {
        console.error(err);
        return;
    }

    console.log(files);

    for (const key in files) {
        if (Object.hasOwnProperty.call(files, key)) {
            const element = files[key];
            console.log(key, element);
        }
    }

    for (const iterator of files) {
        console.log(iterator);
    }

    files.forEach((element, idx, arr) => {
        console.log(element, idx, arr);

    });

    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
    }


}

// read directory Async
async function readExAsyncDirectory(dir) {
    fs.readdir(dir, (error, files) => {
        if (error) {
            console.err(err);
            return
        }
        else {
            console.log(files);
        }
    });
}


// read file Sync
function readExFile(filepath) {
    const file_buffer = fs.readFileSync(filepath);

    console.log(file_buffer.length);
    console.log(file_buffer.values)
}

// read read file Async

async function readExAsyncFile(filepath) {
    fs.readFile(filepath, (err, data) => {
        if (err) {
            return;
        }
        const idx = data.indexOf('\n');
        const sample = data.slice(0, idx).toString();
        console.log(sample)
    })
}

// specify absolute path
//readExDirectory('./supporting_scripts/packet_sample_data');

//readExAsyncDirectory('./supporting_scripts/packet_sample_data');

//readExFile('./supporting_scripts/packet_sample_data/processed_packets_sample.lsp');
readExAsyncFile('./supporting_scripts/packet_sample_data/processed_packets_sample.lsp');