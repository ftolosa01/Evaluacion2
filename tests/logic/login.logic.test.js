import loginLogic from  "../../src/logic/login.logic.js";
import { expect, jest } from "@jest/globals";
import { BusinessError } from "../../src/helpers/error.helper.js";
import UserModel from "../../src/models/user.model.js";

describe("Login Logic: Check text unit test", () => {

	it("[Error]When the user is blocked", async () => {
		const input = {
			email: "test@example.com",
			password: "12345",
		};
		try {
			await loginLogic(input);
		} catch (error) {
			expect(error.msg).toEqual("type is not available");
			expect(error).toBeInstanceOf(BusinessError);
			expect(error.name).toEqual("type error");
		}
	});

	it("[Error]When the username and password does not exist in the selector, it should throw an error", async () => {
		const input = {
			email: "",
			password: "",
		};
		try {
			await loginLogic(input);
		} catch (error) {
			expect(error.msg).toEqual("type is not available");
			expect(error).toBeInstanceOf(BusinessError);
			expect(error.name).toEqual("type error");
		}
	});

	it("[SUCCESS] Should return true when the user is a valid", async () => {

		const input = {
			email: "test@example.com",
			password: "12345",
		};

		const result = await loginLogic(input);

		expect(result).toEqual(true);
	});


});