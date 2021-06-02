
// dont under any circustance reuse or redeclare variable names in javascript , var is outdated only use let and const
// function ordering does not matter

// easier control flow
const { readdirSync, fstatSync, openSync, closeSync, readFileSync } = require('fs');
const Path = require('path');
const Ajv = require("ajv");
const http = require("http");
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
        Submitted_Timestamp: { type: 'number' },
        Size: { type: 'number' },
    },
    required: ['Sniffed_Timestamp', 'Processed_Timestamp', 'Submitted_Timestamp', 'Size'],
    additionalProperties: false
}


const schemaPacket_802_2 = {
    type: 'object',
    properties: {
        DSAP: { type: 'number' },
        SSAP: { type: 'number' },
        Control: { type: 'number' },
    },
    required: ['DSAP', 'SSAP', 'Control'],
    additionalProperties: false
}

const schemaPacket_802_3 = {
    type: 'object',
    properties: {
        Destination_MAC: { type: 'string' },
        Source_MAC: { type: 'string' },
        Ethertype: { type: 'number' },
    },
    required: ['Destination_MAC', 'Source_MAC', 'Ethertype'],
    additionalProperties: false
}


const schemaLSAP_One = {
    type: 'object',
    properties: {
        Message: { type: 'string' }
    }
}

const schemaUnknown = {
    type: 'object',
    properties: {
        Message: { type: 'string' },
        Protocol_Identifier: { type: 'number' }
    },
    required: ['Message', 'Protocol_Identifier'],
    additionalProperties: false
}

const schemaIPv4 = {
    type: 'object',
    properties: {
        Version: { type: 'number' },
        IHL: { type: 'number' },
        DSCP: { type: 'number' },
        ECN: { type: 'number' },
        Total_Length: { type: 'number' },
        Identification: { type: 'number' },
        Flags: { type: 'number' },
        Fragment_Offset: { type: 'number' },
        TTL: { type: 'number' },
        Protocol: { type: 'number' },
        Header_Checksum: { type: 'number' },
        Source_Address: { type: 'string' },
        Destination_Address: { type: 'string' },
        Options: { type: 'object' }
    },
    required: [
        'Version',
        'IHL',
        'ECN',
        'DSCP',
        'Total_Length',
        'Identification',
        'Flags',
        'Fragment_Offset',
        'TTL',
        'Protocol',
        'Header_Checksum',
        'Source_Address',
        'Destination_Address',
        'Options'
    ],
    additionalProperties: false

}

const schemaIPv6 = {
    type: 'object',
    properties: {
        Version: { type: 'number' },
        DS: { type: 'number' },
        ECN: { type: 'number' },
        Flow_Label: { type: 'number' },
        Payload_Length: { type: 'number' },
        Next_Header: { type: 'number' },
        Hop_Limit: { type: 'number' },
        Source_Address: { type: 'string' },
        Destination_Address: { type: 'string' },
        Ext_Headers: {
            type: 'array',
            items: {
                type: 'array',
                items: [
                    { type: 'number' },
                    { type: 'string' }],
                minItems: 2,
                additionalItems: false
            }
        }
    },
    required: [
        'Version',
        'DS',
        'ECN',
        'Flow_Label',
        'Payload_Length',
        'Next_Header',
        'Hop_Limit',
        'Source_Address',
        'Destination_Address',
        'Ext_Headers'
    ],
    additionalProperties: false
}

const schemaARP = {
    type: 'object',
    properties: {
        HTYPE: { type: 'number' },
        PTYPE: { type: 'number' },
        HLEN: { type: 'number' },
        PLEN: { type: 'number' },
        Operation: { type: 'number' },
        SHA: { type: 'string' },
        SPA: { type: 'string' },
        THA: { type: 'string' },
        TPA: { type: 'string' }
    },
    required: [
        'HTYPE',
        'PTYPE',
        'HLEN',
        'PLEN',
        'Operation',
        'SHA',
        'SPA',
        'THA',
        'TPA'
    ],
    additionalProperties: false

}

const schemaCDP = {
    type: 'object'
}

const schemaLLDP = {
    type: 'object',
    properties: {
        TLV: {
            type: 'array',
            items: { // match this pattern ?
                type: 'object',
                properties: {
                    Type: { type: 'number' },
                    Length: { type: 'number' },
                    Value: { type: 'string' }
                }
            }
        } // could be issue
    },
    required: ['TLV'],
    additionalProperties: false
}

const schemaXerox = {
    type: 'object'
}

const schemaIGMP = {
    type: 'object',
    properties: {
        Type: { type: 'number' },
        Max_Response_Time: { type: 'number' },
        Checksum: { type: 'number' },
        Group_Address: { type: 'string' }
    },
    required: ['Type', 'Max_Response_Time', 'Checksum', 'Group_Address'],
    additionalProperties: false
}

const schemaICMPv6 = {
    type: 'object',
    properties: {
        Type: { type: 'number' },
        Code: { type: 'number' },
        Checksum: { type: 'number' },
        Message: { type: 'string' }
    },
    required: ['Type', 'Code', 'Checksum', 'Message'],
    additionalProperties: false
}

const schemaICMP = {
    type: 'object',
    properties: {
        Type: { type: 'number' },
        Code: { type: 'number' },
        Checksum: { type: 'number' },
        Message: { type: 'string' }
    },
    required: ['Type', 'Code', 'Checksum', 'Message'],
    additionalProperties: false
}

const schemaTCP = {
    type: 'object',
    properties: {
        Source_Port: { type: 'number' },
        Destination_Port: { type: 'number' },
        Sequence_Number: { type: 'number' },
        Acknowledgement_Number: { type: 'number' },
        Data_Offset: { type: 'number' },
        Reserved: { type: 'number' },
        Flags: {
            type: 'object',
            properties: {
                NS: { type: 'number' },
                CWR: { type: 'number' },
                ECE: { type: 'number' },
                URG: { type: 'number' },
                ACK: { type: 'number' },
                PSH: { type: 'number' },
                RST: { type: 'number' },
                SYN: { type: 'number' },
                FIN: { type: 'number' },
            }
        },
        Window_Size: { type: 'number' },
        Checksum: { type: 'number' },
        Urgent_Pointer: { type: 'number' },
        Options: {
            type: 'object',
            properties: {

            }
        },
        Payload_Size: { type: 'number' }
    },
    required: [
        'Source_Port',
        'Destination_Port',
        'Sequence_Number',
        'Acknowledgement_Number',
        'Data_Offset',
        'Reserved',
        'Flags',
        'Window_Size',
        'Checksum',
        'Urgent_Pointer',
        'Options',
        'Payload_Size'
    ],
    additionalProperties: false
}

const schemaUDP = {
    type: 'object',
    properties: {
        Source_Port: { type: 'number' },
        Destination_Port: { type: 'number' },
        Length: { type: 'number' },
        Checksum: { type: 'number' },
        Payload_Size: { type: 'number' }
    },
    required: [
        'Source_Port',
        'Destination_Port',
        'Length',
        'Checksum',
        'Payload_Size'
    ],
    additionalProperties: false
}

const validateLSAP_One = ajv.compile(schemaLSAP_One);
const validateUDP = ajv.compile(schemaUDP);
const validateTCP = ajv.compile(schemaTCP);
const validateICMP = ajv.compile(schemaICMP);
const validateICMPv6 = ajv.compile(schemaICMPv6);
const validateIGMP = ajv.compile(schemaIGMP);
const validateXerox = ajv.compile(schemaXerox);

const validateLLDP = ajv.compile(schemaLLDP);
const validateCDP = ajv.compile(schemaCDP);
const validateARP = ajv.compile(schemaARP);
const validateIPv6 = ajv.compile(schemaIPv6);
const validateIPv4 = ajv.compile(schemaIPv4);
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

function selectedValidatorByProtocol(protocol, data) {
    switch (protocol) {
        case 'AF_Packet':
            return validateAF_Packet(data);
        case 'Info':
            return validateInfo(data);
        case 'TCP':
            return validateTCP(data);
        case 'UDP':
            return validateUDP(data);
        case 'Unknown':
            return validateUnknown(data);
        case 'Packet_802_2':
            return validatePacket_802_2(data);
        case 'Packet_802_3':
            return validatePacket_802_3(data);
        case 'IPv4':
            return validateIPv4(data);
        case 'IPv6':
            return validateIPv6(data);
        case 'ARP':
            return validateARP(data);
        case 'CDP':
            return validateCDP(data);
        case 'LLDP':
            return validateLLDP(data);
        case 'Xerox':
            return validateXerox(data);
        case 'IGMP':
            return validateIGMP(data);
        case 'ICMPv6':
            return validateICMPv6(data);
        case 'ICMP':
            return validateICMP(data);
        case 'LSAP_One':
            return validateLSAP_One(data);
        default:
            console.error(`Protocol not handled ${protocol}, ${data}`)
            return false;
    }
}

function dynamicValidator(sampleObject) {
    // array of key 
    //const packet = Object.entries(sampleObject);

    //console.log(typeof sampleObject['AF_Packet']);
    if (validatePacket(sampleObject)) {
        // top level valid
        validateResult = []
        Object.entries(sampleObject).forEach(
            (value) => {

                const [protocol, data] = value;

                console.assert(selectedValidatorByProtocol(protocol, data), protocol, data)
                validateResult.push(selectedValidatorByProtocol(protocol, data));
            }
        )
        // validate all keys
        return validateResult.reduce((previousValue, currentValue) => {
            return previousValue && currentValue;
        });

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
        samples.forEach(sample => {
            const res = parseToObject(sample)

            if (res) {
                console.log(dynamicValidator(res));
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


//const files = validSampleFiles('./supporting_scripts/packet_sample_data/');

//readValidSamples('./supporting_scripts/packet_sample_data/1gig_sample.lsp');

const fakeData = JSON.stringify(
    {
        "Packet_802_3": { "Destination_MAC": "E0:D5:5E:E3:4C:3F", "Source_MAC": "D0:37:45:78:14:38", "Ethertype": 2048 },
        "IPv4": { "Version": 4, "IHL": 5, "DSCP": 4, "ECN": 0, "Total_Length": 140, "Identification": 58602, "Flags": 0, "Fragment_Offset": 0, "TTL": 64, "Protocol": 6, "Header_Checksum": 16743, "Source_Address": "10.0.0.1", "Destination_Address": "10.0.0.10", "Options": {} },
        "TCP": { "Source_Port": 3333, "Destination_Port": 61251, "Sequence_Number": 1844263974, "Acknowledgement_Number": 3378646709, "Data_Offset": 5, "Reserved": 0, "Flags": { "NS": 0, "CWR": 0, "ECE": 0, "URG": 0, "ACK": 1, "PSH": 1, "RST": 0, "SYN": 0, "FIN": 0 }, "Window_Size": 501, "Checksum": 5257, "Urgent_Pointer": 0, "Options": {}, "Payload_Size": 100 },
        "AF_Packet": { "Interface_Name": "eth1", "Ethernet_Protocol_Number": 2048, "Packet_Type": "PACKET_OUTGOING", "ARP_Hardware_Address_Type": 1, "Hardware_Physical_Address": "D0:37:45:78:14:38" },
        "Info": { "Sniffed_Timestamp": 1622227622.8984737, "Processed_Timestamp": 1622227622.8993738, "Size": 154, "Submitted_Timestamp": 1622227623.2125685 }
    }
);

const options = {
    hotstname: 'localhost',
    port: 3000,
    path: '/packets',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': fakeData.length
    }
}

const request = http.request(options, (response) => {
    console.log(`statusCode: ${response.statusCode}`)

    response.on('data', d => {
        process.stdout.write(d)
    })
});

request.on('error', error => {
    console.error(error)
});

request.write(fakeData);
request.end();