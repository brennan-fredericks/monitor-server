const fs = require('fs');
const readline = require('readline');
const async_hooks = require('async_hooks');
const { performance, PerformanceObserver } = require('perf_hooks');

let iloop = 0;
// read file using loop
async function lineByLineLoop(filepath) {
    const filestream = fs.createReadStream(filepath);

    const fin = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    for await (const line of fin) {
        //console.log(`sample: ${line}`);
        //break

        iloop++;
    }
    console.log(iloop);
    fin.close();
    filestream.close();
}

console.time('loop');
lineByLineLoop('./supporting_scripts/packet_sample_data/processed_packets_sample copy.lsp');
console.timeEnd('loop');


let iline = 0;
async function lineByLineEvent(filepath) {
    //const fname = ;
    const rl = readline.createInterface(
        {
            input: fs.createReadStream(filepath),
            crlfDelay: Infinity
        }
    );

    rl.on('line', (line) => {
        //console.log(`${i}: Line from file: ${line}`);
        iline++;
    });
    console.log(iline);
    rl.close();
}
console.time('line');
lineByLineEvent('./supporting_scripts/packet_sample_data/processed_packets_sample.lsp');
console.timeEnd('line');





