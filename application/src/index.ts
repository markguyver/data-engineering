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
const convertDocumentToParquetString = (personObject: IPerson) => {};
const convertDocumentToMessagePackString = (personObject: IPerson) => {};
const saveDocumentToObjectStore = (documentContent: string | Buffer, bucketName: string, objectPath: string) => minioClient.putObject(bucketName, objectPath, documentContent);

const insertIndividualRecordDocuments = (numberOfDocumentsToInsert: number): void => {
    for (let i = 0; i < numberOfDocumentsToInsert; i++) {
        let currentMockPerson = generateFakeRecord();
        let currentUuid = generateFakeUuid();
        saveDocumentToObjectStore(convertDocumentToJsonString(currentMockPerson), process.env.MINIO_BUCKET_JSON || '', currentUuid + '.json');
        saveDocumentToObjectStore(convertDocumentToAvroString(currentMockPerson), process.env.MINIO_BUCKET_AVRO || '', currentUuid + '.avro');
    }
}
const insertSingleDocumentWithMultipleRecords = (numberOfRecordsInDocument: number, objectName: string = 'multiple'): void => {
    let recordBufferObject;
    for (let i = 0; i < numberOfRecordsInDocument; i++) {
        let currentMockPerson = generateFakeRecord();
        if ('undefined' == typeof recordBufferObject) {
            let recordBufferObject = convertDocumentToAvroString(currentMockPerson);
        } else {
            avroType.encode(currentMockPerson, recordBufferObject);
        }
    }
    saveDocumentToObjectStore(recordBufferObject || '', process.env.MINIO_BUCKET_AVRO || '', objectName + '.avro');
};