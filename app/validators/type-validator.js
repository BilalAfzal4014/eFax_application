const _ = require('lodash');
const validator = require('validator');
const GeneralHelper = require('../helpers/general-helper');
const TYPES = Object.freeze({
    STRING: "STRING",
    NULL: "NULL",
    ANY: "ANY",
    NUMBER: "NUMBER",
    ENUM: "ENUM",
    BOOLEAN: "BOOLEAN",
    ARRAY: "ARRAY",
    EMAIL: "EMAIL",
    URL: "URL",
    MOBILE_PHONE: "MOBILE_PHONE",
    DATE: "DATE",
    OBJECT: "OBJECT",
    BUFFER: "BUFFER",
    FILE_UPLOAD_BUFFER: "FILE_UPLOAD_BUFFER",
});

const isNil = (val) => _.isNil(val);
const isNotNil = (val) => !isNil(val);
const isNumber = (val) => isNotNil(val) && _.isFinite(+val);
const isEnum = (val, allowedValues) => allowedValues.includes(val);
const isBoolean = (val) => _.isBoolean(val);
const isArray = (val) => _.isArray(val);
const isEmail = (val) => validator.isEmail(val);
const isURL = (val) => validator.isURL(val);
const isMobilePhone = (val) => validator.isMobilePhone(val.toString(), 'any');
const isDate = (val) => GeneralHelper.isValidDate(val);
const isObject = (val) => typeof val === "object";
const isString = (val) => typeof val === "string";
const isBuffer = (val) => Buffer.isBuffer(val);
const isFileUploadBuffer = (val) => Buffer.isBuffer(val.buffer);

const validate = (val, types, extraParams = null) => {

    let matchType = {};

    for (let type of types) {
        switch (type.dataType) {
            case TYPES.ANY:
                matchType = isNotNil(val) ? type : {};
                break;
            case TYPES.NULL:
                matchType = isNil(val) ? type : {};
                break;
            case TYPES.NUMBER:
                matchType = isNumber(val) ? type : {};
                break;
            case TYPES.BOOLEAN:
                matchType = isBoolean(val) ? type : {};
                break;
            case TYPES.ARRAY:
                matchType = isArray(val) ? type : {};
                break;
            case TYPES.ENUM:
                matchType = isEnum(val, extraParams) ? type : {};
                break;
            case TYPES.EMAIL:
                matchType = isEmail(val) ? type : {};
                break;
            case TYPES.URL:
                matchType = isURL(val) ? type : {};
                break;
            case TYPES.MOBILE_PHONE:
                matchType = isMobilePhone(val) ? type : {};
                break;
            case TYPES.DATE:
                matchType = isDate(val) ? type : {};
                break;
            case TYPES.OBJECT:
                matchType = isObject(val) ? type : {};
                break;
            case TYPES.STRING:
                matchType = isString(val) ? type : {};
                break;
            case TYPES.BUFFER:
                matchType = isBuffer(val) ? type : {};
                break;
            case TYPES.FILE_UPLOAD_BUFFER:
                matchType = isFileUploadBuffer(val) ? type : {};
                break;
            default:
                throw new Error(`Could not determine type validator for ${val}`);
        }

        if (!_.isEmpty(matchType)) {
            matchType.matched = true;
            return matchType;
        }
    }

    matchType.matched = false;
    return matchType;
};

module.exports = {
    TYPES,
    validate
};