import { expect, jest } from "@jest/globals";
import userModel from "../../src/models/user.model";
import { connectDB }  from "../../src/config/mongo";

describe("Models: Check User model unit test", () => {
	const checkUserModelStub = jest.spyOn(userModel, "create");

	it("[SUCCESS] Create User with stub", async () => {
		checkUserModelStub.mockReturnValue();
		userModel.create({name: "asd",email: "texto",password:"12345",  rut:"12345"});
		expect(checkUserModelStub).toBeCalled();
	});

	it("[SUCCESS] Create User successful", async () => {
		connectDB("mongodb://127.0.0.1/auth-service-local");
		checkTextModelStub.mockRestore();
		CheckTextModel.save({ name: "asd",email: "texto",password:"12345",  rut:"12345"});

		const result = await CheckTextModel.findOne({
			type: "asd",
			text: "texto",
		}).exec();
		expect(result).not.toBeNull();
	});
});