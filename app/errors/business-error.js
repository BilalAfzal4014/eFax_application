module.exports = class BusinessError {
    constructor(type, message, extraInfo, errorLocation, data = {}) {
        this.type = type;
        this.message = message;
        this.extraInfo = extraInfo;
        this.errorLocation = errorLocation;
        this.data = data
    }
};