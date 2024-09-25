const accountDao = require("../DAO/AccountDAO");
const uuid = require("uuid");

async function postAccount(account) {
    // Validate the account including checking for username uniqueness
    const isValid = await validateAccount(account);
    if (isValid) {
        // Destructure account and add AccountID
        let data = await accountDao.postAccount({
            ...account, // Spread the account properties
            AccountID: uuid.v4(), // Add unique AccountID using uuid
            Role: account.Role || "Employee" // Set default role to "Employee" if not provided
        });
        return data;
    }
    return null; // Controller layer checks if this is truthy or falsy 
}; 

async function validateAccount(account) {
    // Ensure both Password and Username exist
    if (!account.Password || !account.Username) {
        return false; // Return false if either password or username is missing
    }

    // Check if the username already exists in the database
    const existingAccount = await accountDao.getAccountByUsername(account.Username);
    if (existingAccount) {
        console.error("Username already exists:", account.Username); // Log the duplicate username
        return false; // Return false if the username is already taken
    }

    return true; // Return true if validation passes
}

module.exports = {
    postAccount
};
