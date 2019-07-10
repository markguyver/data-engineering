import avsc from "avsc";
import faker from "faker";
import parquet from "parquetjs";

export interface IRecord {
    firstName: string,
    lastName: string,
    dateofBirth: string
}

export const generateFakeRecord = (): IRecord => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        dateofBirth: String(faker.date.past())
    };
};

export const generateFakeUuid = (): string => {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
};

// @see https://github.com/mtth/avsc/wiki/Advanced-usage
const getAvroRecordSchema = (): avsc.Schema => {
    return {
        type: 'record',
        name: 'personObject',
        fields: [
            {name: 'firstName', type: 'string'},
            {name: 'lastName', type: 'string'},
            {name: 'dateofBirth', type: 'string'}
        ]
    };
};

export const getAvroRecordType = (): avsc.Type => avsc.Type.forSchema(getAvroRecordSchema());

// @see https://github.com/ironSource/parquetjs
export const getParquetRecordSchema = (): parquet.ParquetSchema => new parquet.ParquetSchema({
    firstName: { type: 'UTF8' },
    lastName: { type: 'UTF8' },
    dateofBirth: { type: 'UTF8' }
});