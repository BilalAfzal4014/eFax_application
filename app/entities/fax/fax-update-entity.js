const faxUpdateValidationRules = require("./validations/updata-validation-rules.json");

module.exports = class FaxUpdateEntity {

    getUserProvidedFields = () => ['id'];

    getValidationRules = () => [];

    getFieldsForUniqueness = () => faxUpdateValidationRules;

};