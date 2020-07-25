module.exports = (options = { allowedQueryParams: [] }) => {
  const { allowedQueryParams } = options;

  return function(req, res, next) {
    const query = {};

    try {
      for (var key in req.query) {
        if (allowedQueryParams.includes(key)) {
          const queryValue = req.query[key];

          if (typeof queryValue === "array" && queryValue.length > 0) {
            query._id = { $in: queryValue };
          }

          query[key] = req.query[key];
        }
      }

      req.requestQuery = query;

      return next();

    } catch (e) {
        next(e);
    }
  }
}
