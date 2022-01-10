const axios = require('axios');

const networkCommunication = function (type, url, data = {}, headers = {}) {
    return axios[type](
        url,
        data,
        headers,
    ).then((response) => (response.data))
        .catch((error) => {
            return Promise.reject(error[0] ? error[0].response : error);
        });
};

module.exports = networkCommunication;