const {validate} = require('../validators/type-validator');
const GeneralHelper = require("../helpers/general-helper");

class Validator {

    constructor(payLoad, repo, deleteCheck = false) {
        this.payLoad = payLoad;
        this.repo = repo;
        this.existenceFieldsCollector = [];
        this.uniquenessFieldsCollector = [];
        this.uniquenessAttributes = [];
        this.fieldsError = [];
        this.deleteCheck = deleteCheck;
    }

    validate(attributeRules, attributesForUniqueness) {

        this.uniquenessAttributes = this.collectAttributesForUniqueness(attributesForUniqueness);
        for (let rule of attributeRules) {
            this.validateField(rule);
        }

        return this.validateCollectedFields();
    }


    validateCollectedFields() {
        const validationArray = [];
        validationArray.push(this.validateExistence());
        validationArray.push(this.validateUniqueness());

        return Promise.all(validationArray)
            .then(() => {
                return this.fieldsError;
            });
    }

    validateExistence() {
        return this.validateFromDatabase(this.existenceFieldsCollector, null, [], true)
            .then((rows) => {
                this.checkExistenceFieldsFromDBRecords(rows);
                return true;
            });
    }

    checkExistenceFieldsFromDBRecords(rows) {
        for (let record of rows) {
            if (!this.existenceFieldsCollector.length) {
                break;
            }
            this.removeFieldsWhichExistsInDBRecord(record);
        }

        this.addErrorsForTheFieldsWhichStillExists();
    }

    removeFieldsWhichExistsInDBRecord(record) {
        for (let fieldIndex = 0; fieldIndex < this.existenceFieldsCollector.length; fieldIndex++) {
            if (record[this.existenceFieldsCollector[fieldIndex].key] == this.existenceFieldsCollector[fieldIndex].value) {
                this.existenceFieldsCollector.splice(fieldIndex, 1);
                fieldIndex--;
            }
        }
    }

    addErrorsForTheFieldsWhichStillExists() {
        for (let field of this.existenceFieldsCollector) {
            this.addFieldError(field.column, `${field.column}, ${field.value} doesn't exist`);
        }
    }

    validateUniqueness() {

        return this.validateFromDatabase(this.uniquenessFieldsCollector, this.payLoad["id"], this.uniquenessAttributes, this.deleteCheck)
            .then((rows) => {
                this.checkUniqueFieldsFromDBRecords(rows);
                return true;
            });
    }

    collectAttributesForUniqueness(attributesForUniqueness) {

        const uniquenessAttributes = [];
        for (let attribute of attributesForUniqueness) {
            uniquenessAttributes.push({
                key: attribute,
                value: this.payLoad[attribute]
            });
        }

        return uniquenessAttributes;

    }

    checkUniqueFieldsFromDBRecords(rows) {
        for (let record of rows) {

            if (!this.uniquenessFieldsCollector.length) {
                break;
            }

            this.removeUniqueFieldsWhichDoestExistInDBRecords(record);
        }
    }

    removeUniqueFieldsWhichDoestExistInDBRecords(record) {
        for (let fieldIndex = 0; fieldIndex < this.uniquenessFieldsCollector.length; fieldIndex++) {
            if (record[this.uniquenessFieldsCollector[fieldIndex].key] == this.uniquenessFieldsCollector[fieldIndex].value) {
                this.addFieldError(this.uniquenessFieldsCollector[fieldIndex].column, `${this.uniquenessFieldsCollector[fieldIndex].column} already exist`);
                this.uniquenessFieldsCollector.splice(fieldIndex, 1);
                fieldIndex--;
            }
        }
    }

    validateField(rule) {

        if (this.payLoad[rule.name] === undefined) {
            if (rule.required) {
                this.addFieldError(rule.name, `${rule.name} is required`);
            }
        } else if (rule.minLength && this.payLoad[rule.name].length < rule.minLength) {
            this.addFieldError(rule.name, `${rule.name} must have length greater than equal to ${rule.minLength}`);
        } else if (rule.regularExpression && !GeneralHelper.matchRegularExpressionWithString(rule.regularExpression, this.payLoad[rule.name])) {
            this.addFieldError(rule.name, `${rule.name} doesn't pass regular expression`);
        } else {
            const matchDataType = validate(this.payLoad[rule.name], rule.types, rule.allowedTypes);

            if (this.validateFieldDataTypeMatched(matchDataType, rule)) {
                this.collectFieldIfExist(matchDataType, rule);
                this.collectFieldIfUnique(rule);
            }
        }
    }

    validateFieldDataTypeMatched(matchDataType, rule) {

        if (!matchDataType.matched) {
            this.addFieldError(rule.name,
                rule.allowedTypes.length === 0 ?
                    `${rule.name} cannot have that value` :
                    `${rule.name} can only have these ${rule.allowedTypes} values`
            );
            return false;
        }

        return true;
    }

    collectFieldIfExist(matchDataType, rule) {
        if (matchDataType.exists) {
            this.existenceFieldsCollector.push({
                column: rule.name,
                key: matchDataType.match_with_name,
                value: this.payLoad[rule.name]
            });
        }
    }

    collectFieldIfUnique(rule) {
        if (rule.unique) {
            this.uniquenessFieldsCollector.push({
                column: rule.name,
                key: rule.name,
                value: this.payLoad[rule.name]
            });
        }
    }

    validateFromDatabase(attributes, id, extraAttributes, deleteCheck) {

        if (!attributes.length)
            return Promise.resolve([]);

        if (id) {
            return this.repo.findByAttributesAndIdIsNot(attributes, id, extraAttributes, deleteCheck)
                .then((result) => {
                    return result;
                });

        } else {
            return this.repo.findByAttributes(attributes, extraAttributes, deleteCheck)
                .then((result) => {
                    return result;
                });
        }
    }

    addFieldError(field, error) {
        this.fieldsError.push({field, error});
    }
}

module.exports = Validator;