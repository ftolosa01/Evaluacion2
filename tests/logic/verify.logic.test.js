import UserModel from "../../src/models/user.model.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import verify from "../../src/logic/verify.logic.js";
import verifyMessages from "../../src/messages/verify.messages.js";

jest.mock("../../src/models/user.model.js", () => ({
    findById: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    exec: jest.fn(),
}));

jest.mock("../../src/helpers/error.helper.js", () => {
    return {
        HTTPError: class MockHTTPError extends Error {
            constructor(errorObj) {
                super();
                Object.assign(this, errorObj);
            }
        },
    };
});

describe("Logic verify", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("[ERROR] throws 404 HTTPError when the user not found", async () => {
        UserModel.exec.mockResolvedValue(null);

		const HttpErrror = new HTTPError({
			name: verifyMessages.userNotFound.name,
			msg: verifyMessages.userNotFound.message,
			code: 404,
		});

        try {
            await verify({ userId: "1", code: "code" });
        } catch (error) {
			expect(error instanceof HTTPError).toBe(true);
            expect(error).toEqual(HttpErrror);
        }

        expect(UserModel.findById).toHaveBeenCalledWith("1");
        expect(UserModel.exec).toHaveBeenCalled();
    });

    it("[ERROR] throws 400 HTTPError when the user already verified", async () => {
        UserModel.exec.mockResolvedValue(null);

		const HttpErrror = new HTTPError({
			name: verifyMessages.alreadyVerified.name,
			msg: verifyMessages.alreadyVerified.message,
			code: 404,
		});

        try {
            await verify({ userId: "1", code: "code" });
        } catch (error) {
			expect(error instanceof HTTPError).toBe(true);
            expect(error).toEqual(HttpErrror);
        }

        expect(UserModel.findById).toHaveBeenCalledWith("1");
    });

	it("[ERROR] throws 400 HTTPError when an error throw by verifyToken", async () => {
		const user = {
			_id: "1",
			email: "test@example.com",
			password: "password",
			blocked: false,
			verified: false,
			comparePassword: jest.fn().mockResolvedValue(true),
		};

        UserModel.exec.mockResolvedValue(user);

		const HttpErrror = new HTTPError({
			name: verifyMessages.invalidCode.name,
			msg: verifyMessages.invalidCode.message,
			code: 400,
		});

        try {
            await verify({ userId: "1", code: "code" });
			expect(user.verified).toEqual(fasle);
			
        } catch (error) {
			expect(error instanceof HTTPError).toBe(true);
            expect(error).toEqual(HttpErrror);
        }

        expect(UserModel.findById).toHaveBeenCalledWith("1");
    });

    it("[ERROR] throws 404 HTTPError when the code is null or empty", async () => {
        UserModel.exec.mockResolvedValue(null);

		const HttpErrror = new HTTPError({
			name: verifyMessages.codeNotFound.name,
			msg: verifyMessages.codeNotFound.message,
			code: 404,
		});

        try {
            await verify({ userId: "1", code: "code" });
        } catch (error) {
			expect(error instanceof HTTPError).toBe(true);
            expect(error).toEqual(HttpErrror);
        }

        expect(UserModel.findById).toHaveBeenCalledWith("1");
    });
    it("[ERROR] throws 400 HTTPError when the user code not match with the input code", async () => {
        UserModel.exec.mockResolvedValue(null);

		const HttpErrror = new HTTPError({
			name: verifyMessages.invalidCode.name,
			msg: verifyMessages.invalidCode.message,
			code: 404,
		});

        try {
            await verify({ userId: "1", code: "code" });
        } catch (error) {
			expect(error instanceof HTTPError).toBe(true);
            expect(error).toEqual(HttpErrror);
        }

        expect(UserModel.findById).toHaveBeenCalledWith("1");
    });

    it("[SUCCESS] true if the verify process complete successfully", async () => {
		const user = {
			email: "test@example.com",
			password: "password",
			code:"code",
			blocked: false,
			setVerified: jest.fn().mockResolvedValue(true),
			comparePassword: jest.fn().mockResolvedValue(true),
		};
        UserModel.exec.mockResolvedValue(user);

		const HttpErrror = new HTTPError({
			name: verifyMessages.codeExpired.name,
			msg: verifyMessages.codeExpired.message,
			code: 404,
		});

        try {
            await verify({ userId: "1", code: "code" });
			expect(user.setVerified).toHaveBeenCalled();
        } catch (error) {
			expect(error instanceof HTTPError).toBe(true);
            expect(error).toEqual(HttpErrror);
        }

        expect(UserModel.findById).toHaveBeenCalledWith("1");
		expect(UserModel.findById).toHaveBeenCalledWith("1");
    });
});