class ErrorUtils {
  constructor(http) {
    this.http = http;
  }

  /**
   * Use this function to wrap a function that can cause errors. The result of this function
   * is `HTTPResponse` so it's suitable to use with controller's handlers.
   * @param ctx
   * @param fn
   * @returns
   */
  async handleResponseError(ctx, res, fn) {
    let result = this.http.generateHTTPResponseData(200);
    try {
      result = await fn.call(ctx, result);
      if (result && result.message) {
        result.success.message = result.message;
        delete result.message;
      }
    } catch (error) {
      let code = result.code === 200 ? 500 : result.code;
      result = this.http.generateHTTPResponseData(
        code,
        undefined,
        error.message
      );
    } finally {
      if (result) return res.status(result.code).json(result);
    }
  }

  /**
   * Use this function to wrap a function that can cause errors. The result of this function
   * is `Interchange` so it's suitable to use with some local components.
   * @param ctx
   * @param fn
   * @returns
   */
  async handleInterchangeError(ctx, fn) {
    let result = this.http.generateInterchange(1);

    try {
      let maybePromisedData = fn.call(ctx, result);
      // If function is an async function
      if (maybePromisedData instanceof Promise)
        result = await maybePromisedData;
      else result = maybePromisedData;
    } catch (error) {
      result.code = 0;
      result.message = error.message;
    } finally {
      return result;
    }
  }
}

module.exports = ErrorUtils;
