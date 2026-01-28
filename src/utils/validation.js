const validator = require("validator")

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not vslid!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Create a Strong Password");
    }
}

const validateEditProfileData = (data) => {
    const allowedEditFields = ["firstName", "lastName", "photoURL", "gender", "age", "about", "skills", ];
    
    const isEditAllowed = Object.keys(data).every((field) => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
}