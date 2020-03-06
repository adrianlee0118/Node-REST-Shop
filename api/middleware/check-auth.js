//This middleware will be passed as an argument to api routes before the other functions to maintain the security of those routes (i.e. only execute API CRUD calls if a valid JSON web token has been issued by the server)--this middleware runs before the functions do
//NOTE: we will pass the token via the header, not the body as with usual data, so that the parsing of the form data (token) can be separated from the parsing of the inputs (JSON, URL encoded)

//with the inclusion of this middleware in functions, API calls must be passed along with an authorization JWT token in the header
//JWT makes sure the client can identify itself to the server and access protected resources WITHOUT the server having to store information about the client
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];   //Header comes conventionally with "Bearer <token code>", the split and accessing [1] in array allows us to get only the code
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    
};