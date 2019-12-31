import {Client as MinioClient} from "minio";

const minioBucketAvro = process.env.MINIO_BUCKET_AVRO || '';
const minioBucketJson = process.env.MINIO_BUCKET_JSON || '';
const minioBucketMessagePack = process.env.MINIO_BUCKET_MESSAGEPACK || '';
const minioBucketParquet = process.env.MINIO_BUCKET_PARQUET || '';

const minioConnection = new MinioClient({
    endPoint: process.env.MINIO_HOST || '',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET || ''
});

const saveDocumentToObjectStore = (documentContent: string | Buffer, bucketName: string, objectPath: string): Promise<string> => minioConnection.putObject(bucketName, objectPath, documentContent);

export const saveAvroDocumentToObjectStore = (document: Buffer, documentId: string): Promise<string> => saveDocumentToObjectStore(document, minioBucketAvro, documentId + '.avro');
export const saveJsonDocumentToObjectStore = (document: string, documentId: string): Promise<string> => saveDocumentToObjectStore(document, minioBucketJson, documentId + '.json');
export const saveMessagePackDocumentToObjectStore = (document: string, documentId: string): Promise<string> => saveDocumentToObjectStore(document, minioBucketMessagePack, documentId + '.messagepack');
export const saveParquetDocumentToObjectStore = (document: any, documentId: string): Promise<string> => saveDocumentToObjectStore(document, minioBucketParquet, documentId + '.parquet');