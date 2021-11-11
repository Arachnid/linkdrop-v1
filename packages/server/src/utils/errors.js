/**
 * This file defines application errors.
 */
const util = require('util')
/**
 * Helper function to create generic error object with http status code
 * @param {String} name the error name
 * @param {Number} statusCode the http status code
 * @returns {Function} the error constructor
 * @private
 */
function _createError (name, statusCode) {
  /**
   * The error constructor
   * @param {String} message the error message
   * @param {String} [cause] the error cause
   * @constructor
   */
  function ErrorCtor (message, cause) {
    Error.call(this)
    Error.captureStackTrace(this)
    this.message = message || name
    this.cause = cause
    this.statusCode = statusCode
    this.isOperational = true
  }
  util.inherits(ErrorCtor, Error)
  ErrorCtor.prototype.name = name
  return ErrorCtor
}

module.exports = {
  ValidationError: _createError('ValidationError', 400),
  BadRequestError: _createError('BadRequestError', 400),
  NotFoundError: _createError('NotFoundError', 404),
  ForbiddenError: _createError('ForbiddenError', 403),
  UnauthorizedError: _createError('UnauthorizedError', 401),
  NotImplementedError: _createError('NotImplementedError', 500)
}
