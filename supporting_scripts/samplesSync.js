
// dont under any circustance reuse or redeclare variable names in javascript , var is outdated only use let and const
// function ordering does not matter

// easier control flow
const { readdirSync, fstatSync, openSync, closeSync, readFileSync } = require('fs');
const Path = require('path');
const Ajv = require("ajv");
const { type } = require('os');
const { compileSchema } = require('ajv/dist/compile');
const ajv = new Ajv({ allErrors: true })


// packet schema confirm top level
const schemaPacket = {
    type: 'object',
    properties: {
        Info: { type: 'object' },
        AF_Packet: { type: 'object' }
    },
    required: ['Info', 'AF_Packet'],
    additionalProperties: true
}

const schemaAF_Packet = {
    type: 'object',
    properties: {
        Interface_Name: { type: 'string' },
        Ethernet_Protocol_Number: { type: 'number' },
        Packet_Type: { type: 'string' },
        ARP_Hardware_Address_Type: { type: 'number' },
        Hardware_Physical_Address: { type: 'string' }
    },
    required: ['Interface_Name', 'Ethernet_Protocol_Number', 'Packet_Type', 'ARP_Hardware_Address_Type'],
    additionalProperties: false
}

const schemaInfo = {
    type: 'object',
    properties: {
        Sniffed_Timestamp: { type: 'number' },
        Processed_Timestamp: { type: 'number' },
        Submitter_Timestamp: { type: 'number' },
        Size: { type: 'number' },
    },
    required: ['Sniffed_Timestamp', 'Processed_Timestamp', 'Submitter_Timestamp', 'Size'],
    additionalProperties: false
}


const schemaPacket_802_2 = {
    type: 'object',
    properties: {
        DSAP: { type: 'string' },
        SSAP: { type: 'string' },
        Control: { type: 'string' },
    },
    required: ['DSAP', 'SSAP', 'Control'],
    additionalProperties: false,
}

const schemaPacket_802_3 = {
    type: 'object',
    properties: {
        Destination_MAC: { type: 'string' },
        Source_MAC: { type: 'string' },
        Ethertype: { type: 'number' },
    }
}

const schemaUnknown = {
    type: 'object',
    properties: {
        Message: { type: 'string' },
        Protocol_Identifier: { type: 'number' }
    }
}


const validateUnknown = ajv.compile(schemaUnknown);
const validatePacket_802_3 = ajv.compile(schemaPacket_802_3);
const validatePacket_802_2 = ajv.compile(schemaPacket_802_2);
const validateAF_Packet = ajv.compile(schemaAF_Packet);
const validateInfo = ajv.compile(schemaInfo);

// Ajv compiles schemas to functions and caches them in all cases
const validatePacket = ajv.compile(schemaPacket);

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


function parseToObject(sample) {
    // parses data recursively, parses values as well
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
    //const packet = Object.entries(sampleObject);

    //console.log(typeof sampleObject['AF_Packet']);
    if (validatePacket(sampleObject)) {
        // top level valid
        const protocols = Object.keys(sampleObject)

        // validate all keys
        console.log(validateInfo(sampleObject.Info))
        console.log(validateAF_Packet(sampleObject.AF_Packet))
    }

    return false;

    // check if key is a valid protocol
    // check if key required AF_Packet and Info key is present
    // validate the values which is also a Object

    // only valid if all key , values are valid , and boolean values, if false not valid
}

function readValidSamples(sampleFile) {
    try {
        // samples are split by '\n' character. Beaware of OS newline differences '\n' , '\r\n'
        const samples = readFileSync(sampleFile).toString('utf-8').split('\n');

        // perform conversion  using callback per samples
        samples.slice(0, 2).forEach(sample => {
            const res = parseToObject(sample)

            if (res) {
                dynamicValidator(res);
                //console.log(Object.entries(res));
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


