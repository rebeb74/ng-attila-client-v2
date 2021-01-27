import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as environment from '../../../environments/environment'

@Injectable()
export class StorageService {
    SECRET_KEY = environment.environment.secretKey;

    constructor() { }

    encryptData(data, secretKey) {
        if (!!data) {
            try {
                return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
            } catch (e) {
                console.log(e);
            }
        }
    }

    decryptData(data, secretKey) {
        if (!!data) {
            try {
                const bytes = CryptoJS.AES.decrypt(data, secretKey);
                if (bytes.toString()) {
                    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                }
                return data;
            } catch (e) {
                console.log(e);
            }
        }
    }
}

