const accountDao = require("../DAO/AccountDAO");
const uuid = require("uuid"); 

async function postAccount(account){
    //validate account 
    if(validateAccount(account)){
        let data = await accountDao.postAccount({
            ...account, //object destructuring somehow 
            accountID: uuid.v4()
        });
        return data;
    }
    return null; //controller layer checks if this is truthy or falsy 
}; 

function validateAccount(account){
    return (account.accountID && account.userName); // boolean && operator will return false if either are false 

}

module.exports = {
    postAccount
};