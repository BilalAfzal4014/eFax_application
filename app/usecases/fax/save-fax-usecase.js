const _ = require("lodash");
const BaseUseCase = require("../base/base-usecase");
const FaxEntity = require("../../entities/fax/fax-entity");
const ErrorTypes = require("../../errors/error-types");
const Validator = require("../../entity-validations/validator");
const FaxRepo = require("../../repositories/fax-repo");
const {getStorageProvider} = require("../../providers/storage-providers/storage-provider-factory");
const networkCommunication = require("../../providers/communication-providers/axios-wrapper");

module.exports = class SaveFaxUseCase extends BaseUseCase {
    constructor(fax) {
        super();
        this.fax = fax;
        this.faxEntityInstance = new FaxEntity(fax);
    }

    saveFax() {
        return this.validate()
            .then(() => {
                return this.uploadFileAndSendRequests();
            }).then(() => {
                return this.performSaveAction();
            }).then(() => {
                return {
                    fax_id: this.fax.id,
                    status: "queued"
                };
            });
    }

    validate() {
        return this.validateWithoutThrowingError()
            .then((errorList) => {
                this.handleErrorIfExist(
                    errorList,
                    ErrorTypes.FORBIDDEN,
                    "Fax Validation Failed",
                    "BusinessError from validate function in SaveFaxUseCase",
                    {status: "failure"}
                );
            });
    }

    validateWithoutThrowingError() {
        return this.validateUserProvidedFields();
    }

    validateUserProvidedFields() {
        this.fax = _.pick(this.fax, this.faxEntityInstance.getUserProvidedFields());
        this.validatorInstance = new Validator(this.fax, FaxRepo);

        return this.validatorInstance.validate(
            this.faxEntityInstance.getValidationRules(),
            this.faxEntityInstance.getFieldsForUniqueness()
        );
    }

    uploadFileAndSendRequests() {
        return this.uploadFile();
    }

    uploadFile() {
        const storageProvidingInstance = getStorageProvider();
        return storageProvidingInstance.saveFileFromBuffer(this.fax.file, "pdfs")
            .then((fileInformation) => {
                return this.fax.file = fileInformation.fileCompleteNameWithExtension;
            });
    }

    performSaveAction() {
        return this.save()
            .then(() => {
                this.sendRequests();
            });
    }

    save() {
        return FaxRepo.save(this.trimFaxObject(), this.transactionInstance)
            .then((saveResponse) => {
                return this.fax.id = saveResponse.id;
            });
    }

    trimFaxObject() {
        return {
            ...(this.fax.id && {id: this.fax.id}),
            name: this.fax.name,
            to_phone: this.fax.to_phone,
            file_name: this.fax.file,
        };
    }

    sendRequests() {
        Promise.all([
            this.sendFirstRequest(),
            this.sendSecondRequest()
        ]).then(([firstReq, secondReq]) => {
            console.log("combined response response of first request is", firstReq);
            console.log("combined response response of second request is", secondReq);
        });
    }

    sendFirstRequest() {
        return this.sendNetworkRequestWithTimeout({
            fax_id: this.fax.id,
            status: "failure",
            error: "Busy line",
            attempt: 1
        }, 5000).catch((error) => {
            console.log("response of first request is", error);
            return error;
        });
    }

    sendSecondRequest() {
        return this.sendNetworkRequestWithTimeout({
            fax_id: this.fax.id,
            status: "success",
            error: null,
            attempt: 2
        }, 10000)
            .then((resp) => {
                console.log("response of second request is", resp);
                return resp;
            });
    }

    sendNetworkRequestWithTimeout(data, timeOut = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.sendNetworkRequest(data)
                    .then((resp) => resolve(resp))
                    .catch((error) => reject(error));
            }, timeOut);
        });
    }

    sendNetworkRequest(data) {
        return networkCommunication("post",
            "http://localhost:4444/v1/fax/receiveFaxStatus",
            data);
    }
}