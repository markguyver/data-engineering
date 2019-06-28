// Load Dependencies
import avsc from "avsc";
import dotenv from "dotenv";
import minio from "minio";
import {IPerson} from "./DataTypes";
import {generateFakeRecord, generateFakeUuid} from "./fakeDataGenerator"

// Bootstrap Script
dotenv.config();
const avroType = avsc.Type.forSchema({
    type: 'record',
    name: 'personObject',
    fields: [
        {name: 'firstName', type: 'string'},
        {name: 'lastName', type: 'string'},
        {name: 'dateofBirth', type: 'string'}
    ]
});
const minioClient = new minio.Client({
    endPoint: process.env.MINIO_HOST || '',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET || ''
});

// Define Functions to Be Used
const convertDocumentToJsonString = (personObject: IPerson): string => JSON.stringify(personObject);
const convertDocumentToAvroString = (personObject: IPerson): Buffer => avroType.toBuffer(personObject);
const saveDocumentToObjectStore = (documentContent: string | Buffer, bucketName: string, objectPath: string) => minioClient.putObject(bucketName, objectPath, documentContent);

// Perform Script - 1 Record Per File
// for (let i = 0; i < 100; i++) {
//     let currentMockPerson = generateFakeRecord();
//     let currentUuid = generateFakeUuid();
//     saveDocumentToObjectStore(convertDocumentToJsonString(currentMockPerson), 'json', currentUuid + '.json');
//     saveDocumentToObjectStore(convertDocumentToAvroString(currentMockPerson), 'avro', currentUuid + '.avro');
// }

// Perform Script - 1 File for All Records
let recordBufferObject;
for (let i = 0; i < 100; i++) {
    let currentMockPerson = generateFakeRecord();
    if ('undefined' == typeof recordBufferObject) {
        let recordBufferObject = convertDocumentToAvroString(currentMockPerson);
    } else {
        avroType.encode(currentMockPerson, recordBufferObject);
    }
}
saveDocumentToObjectStore(recordBufferObject || '', 'avro', 'multiple.avro');