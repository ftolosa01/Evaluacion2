import { authMiddleware } from '../src/middlewares.js';
import { returnErrorResponse } from '../src/helpers/error.helper.js';
import { verifyToken } from '../src/helpers/jwt.helper.js';

jest.mock("../src/helpers/error.helper.js");
jest.mock("../src/helpers/jwt.helper.js");

describe("authMiddleware", () => {
  let req;
  let res;
  let next;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("[ERROR] authorization token is missing and return 401", () => {
    res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
    req = {
        headers: {},
      };

      next = jest.fn();
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("[SUCCESS] token and id is valid", () => {
    res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      req = {
        headers: {},
      };

    const token = "token";
    const payload = { id: "user-id" };
    req.headers = {
      Authorization: `Bearer ${token}`,
    };
    verifyToken.mockReturnValue(payload);

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(req.userId).toBe(payload.id);
  });

  it("[ERROR] token, fails with returnErrorResponse", () => {
    res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      req = {
        headers: {},
      };
    const error = new Error("Token verification failed");
    const token = "token";
    req.headers = {
      Authorization: `Bearer ${token}`,
    };
    verifyToken.mockImplementation(() => {
      throw error;
    });

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(returnErrorResponse).toHaveBeenCalledWith(error, res);
  });
});