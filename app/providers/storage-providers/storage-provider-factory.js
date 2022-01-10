const LocalStorage = require('./impl/local/local-storage');
const ProviderTypes = require('./provider-types');

let provider = null;
const getStorageProvider = () => {
    if (null === provider) {
        const type = process.env.STORAGE_PROVIDER_TYPE || ProviderTypes.LOCAL;
        switch (type) {
            case ProviderTypes.LOCAL:
                provider = new LocalStorage();
                break;
            default:
                throw new Error("Could not find suitable storage provider");
        }
    }
    return provider;
};

module.exports = {
    getStorageProvider
}