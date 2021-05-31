const Ajv = require("ajv");


// // Class expression
// let class_name  = class {
//     constructor(method1, method2) {
//        this.method1 = method1;
//        this.method2= method2;
//      }
//    };

//    // Class declaration
//    class class_name {
//      constructor(method1, method2) {
//        this.method1 = method1;
//        this.method2= method2;
//      }
//    }

class PacketValidation {
    constructor() {
        this._packetSchemas = new Map()
        this._ajv = new Ajv({ allErrors: true })
    }

    addKeyValidation(keyName, valueSchema) {
        // add new schema for validation
        try {
            this._packetSchemas[keyName] = this._ajv.compile(valueSchema);
        }
        catch (err) {
            // force failure
            throw new Error(`{err}`);
        }
    }

    _validator(keyName, valueData) {
        try {
            // check if keyName in Map
            if (!this._packetSchemas.has(keyName)) {
                return false;
            }

            return this._packetSchemas.get(keyName)(valueData);
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }

    validatePacket(packetData) {
        // top level valid
        Object.entries(packetData).forEach(
            (value) => {
                //destruct  
                const [key, data] = value;

                // terminate early if the data is not valid, no point in check further
                if (!this._validator(key, data)) return false;
            }
        )

        // the submission was valid
        return true;
    }

}

const packetValidation = new PacketValidation();


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

packetValidation.addKeyValidation('Packet', schemaPacket)




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


