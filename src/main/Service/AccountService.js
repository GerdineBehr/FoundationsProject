const accountDao = require("../DAO/AccountDAO");
const uuid = require("uuid"); 

async function postAccount(account) {
    // Validate the account
    if (validateAccount(account)) {
        // Destructure account and add AccountID
        let data = await accountDao.postAccount({
            ...account, // Spread the account properties
            AccountID: uuid.v4() // Add unique AccountID using uuid
        });
        return data;
    }
    return null; // Controller layer checks if this is truthy or falsy 
}; 

function validateAccount(account) {
    // Ensure both Password and Username exist
    return (account.Password && account.Username); // Boolean && operator will return false if either are missing
}

module.exports = {
    postAccount
};
