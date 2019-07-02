// Load Dependencies
import avsc from "avsc";
import dotenv from "dotenv";
import minio from "minio";
import msgpack5 from "msgpack5";
import parquet from "parquetjs";
import {IPerson} from "./DataTypes";
import {generateFakeRecord, generateFakeUuid} from "./fakeDataGenerator"

// Bootstrap Script: Load Configuration
dotenv.config();

// Bootstrap Script: Define Variables
const minioBucketAvro = process.env.MINIO_BUCKET_AVRO || '';
const minioBucketJson = process.env.MINIO_BUCKET_JSON || '';
const minioBucketMessagePack = process.env.MINIO_BUCKET_MESSAGEPACK || '';
const minioBucketParquet = process.env.MINIO_BUCKET_PARQUET || '';

// Bootstrap Script: Load Imported Modules
const avroType = avsc.Type.forSchema({
    type: 'record',
    name: 'personObject',
    fields: [
        {name: 'firstName', type: 'string'},
        {name: 'lastName', type: 'string'},
        {name: 'dateofBirth', type: 'string'}
    ]
});
const messagePack = msgpack5();
const minioClient = new minio.Client({
    endPoint: process.env.MINIO_HOST || '',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET || ''
});
const parquetSchema = new parquet.ParquetSchema({
    firstName: { type: 'UTF8' },
    lastName: { type: 'UTF8' },
    dateofBirth: { type: 'UTF8' }
});

// Define Non-Exported Functions
const convertDocumentToJsonString = (personObject: IPerson): string => JSON.stringify(personObject);
const convertDocumentToAvroString = (personObject: IPerson): Buffer => avroType.toBuffer(personObject);
const convertDocumentToParquetString = (personObject: IPerson) => '';
const convertDocumentToMessagePackString = (personObject: IPerson): string => messagePack.encode(personObject).toString('hex');
const saveDocumentToObjectStore = (documentContent: string | Buffer, bucketName: string, objectPath: string) => minioClient.putObject(bucketName, objectPath, documentContent);

// Define Exported Functions
export const insertIndividualRecordDocuments = (numberOfDocumentsToInsert: number): void => {
    for (let i = 0; i < numberOfDocumentsToInsert; i++) {
        let currentMockPerson = generateFakeRecord();
        let currentUuid = generateFakeUuid();
        saveDocumentToObjectStore(convertDocumentToAvroString(currentMockPerson), minioBucketAvro, currentUuid + '.avro');
        saveDocumentToObjectStore(convertDocumentToJsonString(currentMockPerson), minioBucketJson, currentUuid + '.json');
        saveDocumentToObjectStore(convertDocumentToMessagePackString(currentMockPerson), minioBucketMessagePack, currentUuid + '.messagepack');
        // saveDocumentToObjectStore(convertDocumentToParquetString(currentMockPerson), minioBucketParquet, currentUuid + '.parquet');
    }
}