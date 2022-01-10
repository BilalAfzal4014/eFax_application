module.exports = class GeneralHelper {

    static isValidDate(dateString) {
        //let regEx = /^\d{4}-\d{2}-\d{2}$/;
        let regularExpressionString = "^\\d{4}-\\d{2}-\\d{2}$";
        let regEx = new RegExp(regularExpressionString);

        if (!dateString.match(regEx))
            return false;

        let d = new Date(dateString);
        let dNum = d.getTime();

        if (!dNum && dNum !== 0)
            return false;

        return d.toISOString().slice(0, 10) === dateString;
    }

    static matchRegularExpressionWithString(regularExpression, string) {
        let regEx = new RegExp(regularExpression);
        return string.match(regEx);
    }

    static isValueExistInArray(array, value) {
        return array.indexOf(value) > -1;
    }
};