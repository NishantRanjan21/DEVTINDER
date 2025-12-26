const authorisation = (req, res, next) => {
    const token = 'xyz';
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.send("you are not authorized");
    }
    else{
        next();
    }
};

module.exports = {
    authorisation
};