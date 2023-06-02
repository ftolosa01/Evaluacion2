import login from "../../src/logic/login.logic.js";
import UserModel from "../../src/models/user.model.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import loginMessages from "../../src/messages/login.messages.js";

jest.mock("../../src/models/user.model.js");
jest.mock("../../src/helpers/jwt.helper.js");

describe("login logic", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("[ERROR] user is blocked", async () => {
	const user = {
		_id: "id",
		email: "test@example.com",
		password: "password",
		blocked: true,
		verified: true,
		comparePassword: jest.fn().mockResolvedValue(true),
	};

	const HttpErrror = new HTTPError({
		name: loginMessages.blocked.name,
		msg: loginMessages.blocked.message,
		code: 403,
	});
	UserModel.findOne.mockReturnValue({
		select: jest.fn().mockReturnValue({
		exec: jest.fn().mockResolvedValue(user),
		}),
	});

	return login({ email: "test@example.com", password: "password" }).catch((error) => {
		expect(error).toEqual(HttpErrror);
	});

	});

	it("[ERROR] user no found", async () => {
		const HttpErrror = new HTTPError({
				name: loginMessages.invalidCredentials.name,
				msg: loginMessages.invalidCredentials.message,
				code: 400,
		});
		UserModel.findOne.mockReturnValue({
			select: jest.fn().mockReturnValue({
			exec: jest.fn().mockResolvedValue(false),
			}),
		});

		return login({ email: "test@example.com", password: "password" }).catch((error) => {
			expect(error).toEqual(HttpErrror);
		});	
	
	});

	it("[ERROR] invalid password", async () => {

		const user = {
			_id: "id",
			email: "test@example.com",
			password: "password",
			blocked: false,
			verified: true,
			comparePassword: jest.fn().mockResolvedValue(false),
		};

		const HttpErrror = new HTTPError({
			name: loginMessages.invalidCredentials.name,
			msg: loginMessages.invalidCredentials.message,
			code: 400,
		});
		UserModel.findOne.mockReturnValue({
			select: jest.fn().mockReturnValue({
			exec: jest.fn().mockResolvedValue(user),
			}),
		});

		return login({ email: "test@example.com", password: "password" }).catch((error) => {
			expect(error).toEqual(HttpErrror);
			expect(user.comparePassword).toHaveBeenCalledWith("password");
			
		});	
	
	});

	it("[Susseful] user found", async () => {

		const user = {
			_id: "id",
			email: "test@example.com",
			password: "password",
			blocked: false,
			verified: true,
			comparePassword: jest.fn().mockResolvedValue(true),
		};

		UserModel.findOne.mockReturnValue({
			select: jest.fn().mockReturnValue({
			exec: jest.fn().mockResolvedValue(user),
			}),
		});
		return login({ email: "test@example.com", password: "password" }).catch((error) => {
			expect(UserModel.findOne).toEqual(user);
			expect(UserModel.findOne._id).toEqual(user._id);
			expect(UserModel.findOne.verified).toEqual(user.verified);
		});	

	
	});
});