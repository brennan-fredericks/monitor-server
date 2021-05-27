const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');


async function processSamples(filepath) {
    try {
        // create file stream and input to readline
        const rl = createInterface({
            input: createReadStream(filepath),
            crlfDelay: Infinity
        });

        rl.on('line', () => {
            console.log("======================");
        })

        rl.on('line', (line) => {
            // post to database
            // api
            console.log(line);
        })

        // wait until file is closed
        await once(rl, 'close');
        console.info(`Done processing ${filepath}`)

    }
    catch (err) {
        console.error(err);
    }
}

processSamples('./supporting_scripts/packet_sample_data/processed_packets_sample.lsp');