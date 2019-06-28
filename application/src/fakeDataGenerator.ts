import faker from "faker";
import {IPerson} from "./DataTypes";

export const generateFakeRecord = (): IPerson => {
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