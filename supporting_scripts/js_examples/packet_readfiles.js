const { once } = require('events');
const { createReadStream, readdir } = require('fs');
const Path = require('path');
const { createInterface } = require('readline');

async function parseToObject(line) {
    try {
        const packetObject = JSON.parse(line);

        return packetObject;
    }
    catch (err) {
        console.error(`logged: ${err}`);
        return null;
    }
}

// retrieve list of files in director
async function postSamples(filepath) {

    readdir(filepath, async (err, files) => {
        if (err) {
            console.error(err);
            throw new Error(err);
        }


        files.slice(0, 1).forEach((value) => {
            processFile(Path.join(filepath, value));
        })
    });
}

async function processFile(filepath) {

    try {
        // create file stream and input to readline
        const rl = createInterface({
            input: createReadStream(filepath),
            crlfDelay: Infinity
        });

        rl.on('line', async (line) => {
            // post to database
            // api
            const packet = await parseToObject(line);
            if (packet) {
                console.log(Object.keys(packet));
                console.log(Object.entries(packet));
            } else {
                console.log(packet);
            }

            process.nextTick(() => {
                rl.emit('close');
            });
        })

        // close file after first line read?
        // wait until file is closed
        await once(rl, 'close');
        console.info(`Done processing ${filepath}`)

    }
    catch (err) {
        console.error(err);
    }
}

//processSamples('./supporting_scripts/packet_sample_data/processed_packets_sample.lsp');
postSamples('./supporting_scripts/packet_sample_data/');