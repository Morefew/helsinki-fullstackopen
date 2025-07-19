

/*
 * @function info
 * @description Provides logging function for informational messages.
 * It will log messages to the console unless the environment is set to 'test'.
 * @param {...any} params - The parameters to log.
 * @returns {void}
 * @example
 * info('Server started on port:', port);
 * @memberof module:utils/logger
 */
const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

/*
 * @function error
 * @description Provides logging function for error messages.
 * It will log messages to the console unless the environment is set to 'test'.
 * @param {...any} params - The parameters to log.
 * @returns {void}
 * @example
 * error('An error occurred:', errorMessage);
 * @memberof module:utils/logger
 *
 * Extracting logging into its own module is a good idea in several ways. If we wanted to start writing logs to a file or send them to an external logging service like graylog or papertrail we would only have to make changes in one place.
 */

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

/* Logger Utility Module
 * @module utils/logger
 * Better logging utility for Node.js applications
 * this module substitutes console.log and console.error
 * with custom logging functions that can be controlled
 * based on the environment.
 */
export default { info, error };
