// I know that is isolated system. But in any case, security is important. That is my two cents.
// It also provides functionality for consistency of data. I mean it is better to know which user do what.

const messageObj = require("./messages.js")

const cookieCheck = (req, res, next) => {
  
    const cookie = req.headers.cookie; 
  
    if (!cookie) {
        return res.status(401).json({
            "success": false,
            "message": messageObj["LoginIsRequired"],
            "object": null
        });
    }
 
    next(); 
  };
  

module.exports = cookieCheck;