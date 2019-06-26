// Load Dependencies
import avsc from "avsc";
import dotenv from 'dotenv';
import minio from "minio";
import mongoose from "mongoose";

// Bootstrap Script
dotenv.config();

// Define Functions to Be Used

const retrieveFromFilesystemDocuments = () => {
};

const convertDocumentToJsonString = (mongoDocument: any): string => {
    return ''; // @todo Delete This
};

const convertDocumentToAvroString = (mongoDocument: any): string => {
    return ''; // @todo Delete This
};

const saveDocumentToObjectStore = (documentContent: string, bucketName: string, objectPath: string) => {
};

// Kick Off the Process
console.log('Data Engineering Script:', process); // @todo Delete This