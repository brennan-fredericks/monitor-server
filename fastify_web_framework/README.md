# Notes

# Endpoint to received processed network packets

a client application send JSON structured data where the keys are the protocols that was contained in the network packet and the value are the attributes and attrute_values for the specific protocol

samples of data that could be posted 

```json
{
  "Packet_802_3": {
    "Destination_MAC": "00:15:5D:44:43:68",
    "Source_MAC": "00:15:5D:3C:5F:B2",
    "Ethertype": 2048
  },
  "IPv4": {
    "Version": 4,
    "IHL": 5,
    "DSCP": 0,
    "ECN": 0,
    "Total_Length": 40,
    "Identification": 10936,
    "Flags": 0,
    "Fragment_Offset": 0,
    "TTL": 128,
    "Protocol": 6,
    "Header_Checksum": 37099,
    "Source_Address": "172.27.112.1",
    "Destination_Address": "172.27.118.244",
    "Options": {}
  },
  "TCP": {
    "Source_Port": 7996,
    "Destination_Port": 34975,
    "Sequence_Number": 1114847414,
    "Acknowledgement_Number": 1280964045,
    "Data_Offset": 5,
    "Reserved": 0,
    "Flags": {
      "NS": 0,
      "CWR": 0,
      "ECE": 0,
      "URG": 0,
      "ACK": 1,
      "PSH": 0,
      "RST": 0,
      "SYN": 0,
      "FIN": 0
    },
    "Window_Size": 8211,
    "Checksum": 60264,
    "Urgent_Pointer": 0,
    "Options": {},
    "Payload_Size": 0
  },
  "AF_Packet": {
    "Interface_Name": "eth0",
    "Ethernet_Protocol_Number": 2048,
    "Packet_Type": "PACKET_HOST",
    "ARP_Hardware_Address_Type": 1,
    "Hardware_Physical_Address": "00:15:5D:3C:5F:B2"
  },
  "Info": {
    "Sniffed_Timestamp": 1621670781.0331273,
    "Processed_Timestamp": 1621670781.0334582,
    "Size": 54,
    "Submitter_Timestamp": 1621670781.0339828
  }
}
```
```JSON
{
  "Packet_802_3": {
    "Destination_MAC": "00:15:5D:44:43:68",
    "Source_MAC": "00:15:5D:3C:5F:B2",
    "Ethertype": 2048
  },
  "IPv4": {
    "Version": 4,
    "IHL": 5,
    "DSCP": 0,
    "ECN": 0,
    "Total_Length": 235,
    "Identification": 10799,
    "Flags": 0,
    "Fragment_Offset": 0,
    "TTL": 128,
    "Protocol": 17,
    "Header_Checksum": 53414,
    "Source_Address": "172.27.112.1",
    "Destination_Address": "172.27.118.244",
    "Options": {}
  },
  "UDP": {
    "Source_Port": 53,
    "Destination_Port": 41838,
    "Length": 215,
    "Checksum": 58580,
    "Payload_Size": 207
  },
  "AF_Packet": {
    "Interface_Name": "eth0",
    "Ethernet_Protocol_Number": 2048,
    "Packet_Type": "PACKET_HOST",
    "ARP_Hardware_Address_Type": 1,
    "Hardware_Physical_Address": "00:15:5D:3C:5F:B2"
  },
  "Info": {
    "Sniffed_Timestamp": 1621670770.5545073,
    "Processed_Timestamp": 1621670770.5546613,
    "Size": 249,
    "Submitter_Timestamp": 1621670770.5977757
  }
}
```

## Consideration

- The keys of the JSON structure are the protocols encapsulated in a network packet which will be `dynamic`
(i.e. the protocols are related to application communicating on network).
    - [] The `Info` and `AF_Packet` keys are contained in each post.
    - The other keys i.e. `IPv4`,`IPv6`,`IGMP` differs betweem JSON structure 
- Data storage:
    - the data will be stored in a mongodb (learning to work with mongodb) database
    - [] Every protocol type should have it's own collection
    - [] The `Info` collection should be reference by all other collection. i.e. a one-to-many relationship (a network packet can contain many encapsulated protocols).
    - [] Should be able to delete across all protocol collections using `Info` key

- [] JSON structure needs to be separete and each key/protocol needs to be validated independently before reply to the client with success or failure

## Operations

- validate all protocol agaist a predefined schema for each 
- once the data is validated it should be stored in the database (insert directly are use pub_sub?) 



