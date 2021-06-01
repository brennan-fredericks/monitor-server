/*
*/
const Ajv = require("ajv");
const { MongoClient } = require('mongodb');

const dynAjv = new Ajv({ allErrors: true });
const PacketValidator = new Map()

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
PacketValidator.set('Info', dynAjv.compile(schemaInfo));

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
PacketValidator.set('AF_Packet', dynAjv.compile(schemaAF_Packet));

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
PacketValidator.set('Packet_802_2', dynAjv.compile(schemaPacket_802_2));

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
PacketValidator.set('Packet_802_3', dynAjv.compile(schemaPacket_802_3));


const schemaLSAP_One = {
    type: 'object',
    properties: {
        Message: { type: 'string' }
    }
}
PacketValidator.set('LSAP_One', dynAjv.compile(schemaLSAP_One));

const schemaUnknown = {
    type: 'object',
    properties: {
        Message: { type: 'string' },
        Protocol_Identifier: { type: 'number' }
    },
    required: ['Message', 'Protocol_Identifier'],
    additionalProperties: false
}
PacketValidator.set('Unknown', dynAjv.compile(schemaUnknown));

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
PacketValidator.set('IPv4', dynAjv.compile(schemaIPv4));

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

PacketValidator.set('IPv6', dynAjv.compile(schemaIPv6));

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

PacketValidator.set('ARP', dynAjv.compile(schemaARP));

const schemaCDP = {
    type: 'object'
}
PacketValidator.set('CDP', dynAjv.compile(schemaCDP));

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
PacketValidator.set('LLDP', dynAjv.compile(schemaLLDP));

const schemaXerox = {
    type: 'object'
}
PacketValidator.set('Xerox', dynAjv.compile(schemaXerox));

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
PacketValidator.set('IGMP', dynAjv.compile(schemaIGMP));

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
PacketValidator.set('ICMPv6', dynAjv.compile(schemaICMPv6));

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
PacketValidator.set('ICMP', dynAjv.compile(schemaICMP));

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
PacketValidator.set('TCP', dynAjv.compile(schemaTCP));

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
PacketValidator.set('UDP', dynAjv.compile(schemaUDP));


async function validatePacket(packet) {

    // check that the key and values are valid, skip unknown keys
    for (const [k, v] of Object.entries(packet)) {

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





// add auto completion support
/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = async function (fastify, opts) {

    const schemaRootResponse = {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }
    // add schema for response
    fastify.get('/', { schemaRootResponse }, packetGetHandler);

    const bodyJsonSchema = {
        type: 'object',
        required: ['Info', 'AF_Packet'],
        properties: {
            Info: { type: 'object' },
            AF_Packet: { type: 'object' }
        },
        additionalProperties: true
    }

    const headersJsonSchema = {
        type: 'object',
        properties: {
            'content-type': { type: 'string' }
        },
        required: ['content-type']
    }

    const schemaPostResponse = {
        response: {
            'xxx': {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            },
            201: {
                message: { type: 'string' }
            }
            ,
            400: {
                message: { type: 'string' }
            }
        }
    }
    const schema = {
        body: bodyJsonSchema,
        headers: headersJsonSchema,
        response: schemaPostResponse
    }
    fastify.post('/', { schema }, packetPostHandler);


    async function packetPostHandler(request, reply) {
        // validate internal data
        const valid = await validatePacket(request.body);
        console.log(fastify.config);
        if (valid) {

            // add to database

            reply
                .code(201)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ message: 'added packet data' });
        }

        reply
            .code(400)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ message: 'packet data invalid' });

    }


    async function packetGetHandler(request, reply) {
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ message: 'packet endpoint 200' });
    }



}
