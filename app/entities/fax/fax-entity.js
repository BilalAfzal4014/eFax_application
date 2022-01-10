const FaxCreateEntity = require("./fax-create-entity");
const FaxUpdateEntity = require("./fax-update-entity");
const validationRules = require("./validations/validation-rules.json");

class FaxEntity {
    constructor(fax) {
        this.faxEntityDesiredInstance = FaxEntity.getDesiredInstance(fax);
    }

    static getDesiredInstance(fax) {
        if (fax.id === undefined) {
            return new FaxCreateEntity();
        }
        return new FaxUpdateEntity();
    }

    getValidationRules = () => {
        return [...this.faxEntityDesiredInstance.getValidationRules(), ...validationRules];
    }

    getUserProvidedFields = () => {
        const userProvidedFields = ['name', 'to_phone', 'file', 'callback_url'];
        return [...this.faxEntityDesiredInstance.getUserProvidedFields(), ...userProvidedFields]
    };

    getFieldsForUniqueness = () => ([...this.faxEntityDesiredInstance.getFieldsForUniqueness()]);

}

module.exports = FaxEntity;