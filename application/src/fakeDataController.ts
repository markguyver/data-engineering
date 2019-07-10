// Load Dependencies
import dotenv from "dotenv";
import msgpack5 from "msgpack5";
import {IRecord, generateFakeRecord, generateFakeUuid, getAvroRecordType, getParquetRecordSchema} from "./fakeDataGenerator"
import {saveAvroDocumentToObjectStore, saveJsonDocumentToObjectStore, saveMessagePackDocumentToObjectStore, saveParquetDocumentToObjectStore} from "./persistenceModel";

// Bootstrap Script
dotenv.config();
const avroType = getAvroRecordType();
const messagePack = msgpack5();
const parquetSchema = getParquetRecordSchema();

// Define Data Conversion Functions
const convertDocumentToJsonString = (recordObject: IRecord): string => JSON.stringify(recordObject);
const convertDocumentToAvroString = (recordObject: IRecord): Buffer => avroType.toBuffer(recordObject);
const convertDocumentToParquetString = (recordObject: IRecord) => {
    // @todo Add Functionality Here
};
const convertDocumentToMessagePackString = (recordObject: IRecord): string => messagePack.encode(recordObject).toString('hex');

// Define Exported Function
export const insertIndividualRecordDocuments = (numberOfDocumentsToInsert: number): void => {
    for (let i = 0; i < numberOfDocumentsToInsert; i++) {
        let currentRecord = generateFakeRecord();
        let currentUuid = generateFakeUuid();
        saveAvroDocumentToObjectStore(convertDocumentToAvroString(currentRecord), currentUuid);
        saveJsonDocumentToObjectStore(convertDocumentToJsonString(currentRecord), currentUuid);
        saveMessagePackDocumentToObjectStore(convertDocumentToMessagePackString(currentRecord), currentUuid);
        saveParquetDocumentToObjectStore(convertDocumentToParquetString(currentRecord), currentUuid);
    }
}