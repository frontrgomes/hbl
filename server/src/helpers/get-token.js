const getToken = (req) => {
    const authHeader = req.headers.authorization 
    const token = authHeader.split(' ')[1] //splita e pega o token, no primeiro array
    return token
}

module.exports = getToken