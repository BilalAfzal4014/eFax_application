const BusinessError = require('../../errors/business-error');

module.exports = class BaseUseCase {

    constructor(transaction = null) {
        this.transactionInstance = transaction;
    }

    handleErrorIfExist(errorsList, errorType, message, location, data = {}) {
        if (this.hasError(errorsList)) {
            this.handleError(
                errorsList,
                errorType,
                message,
                location,
                data
            );
        }
    }

    hasError(errorsList) {
        return errorsList.length > 0;
    }

    handleError(errorsList, errorType, message, location, data = {}) {
        throw new BusinessError(
            errorType,
            message,
            errorsList,
            location,
            data
        );
    }
}