const { CustomAPIError } = require('../errors/errors')
const errorHandlerMiddleware = (err, req, res, next) => {

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err.name === "CastError") {
    return res.status(500).json({ msg: "the form of id  that you entered is not correct" })
    }
    try {
        if (err._message) {
          return res.status(500).json({ msg:err.message})
      
        }
        
      } catch (err) {
        
      }
  return res.status(500).json({ msg: err })
}

module.exports = errorHandlerMiddleware
