class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

//
const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;
  console.log(err);
  res
    .status(statusCode || 500)
    .send({ message: statusCode ? message : "An error occurred" });
};

export { CustomError, handleError };
