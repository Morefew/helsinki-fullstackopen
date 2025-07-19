import "dotenv/config";

const PORT = process.env.PORT;
// const MONGODB_URI = process.env.NODE_ENV === 'test'
//   ? process.env.MONGODB_URI_TEST
//   : process.env.MONGODB_URI_PROD;

let MONGODB_URI;

switch (process.env.NODE_ENV) {
  case "prod":
    MONGODB_URI = process.env.MONGODB_URI_PROD;
    break;
  case "dev":
    MONGODB_URI = process.env.MONGODB_URI_DEV;
    break;
  default:
    MONGODB_URI = process.env.MONGODB_URI_TEST;
    break;
}

const SECRET = process.env.SECRET;

const TEST_SECRET = process.env.TEST_SECRET;

const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODdhYzk3MTQxYWY2NTllMzUyNzdiN2UiLCJ1c2VybmFtZSI6IlRlc3RVc2VyT25lIn0.xf8EeoBbye41dpT-boA7vb3-kBVHLKMBkF6YRi3kbbY"

export default { SECRET, PORT, MONGODB_URI, TEST_SECRET, TEST_TOKEN };
