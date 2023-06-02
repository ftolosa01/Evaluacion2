import { expect, jest } from "@jest/globals";
import userModel from "../../src/models/user.model";
import { connectDB }  from "../../src/config/mongo";

describe("Models: Check User model unit test", () => {
	const checkUserModelStub = jest.spyOn(userModel, "default");

	it("[SUCCESS] Create User successful", async () => {
		await connectDB("mongodb://127.0.0.1/auth-service-local");
		checkUserModelStub.mockRestore();
		userModel.save({ name: "asd",email: "texto",password:"12345",  rut:"12345"});

		const result = await userModel.findOne({
			name: "asd",email: "texto",password:"12345",  rut:"12345"
		}).exec();
		expect(result).not.toBeNull();
	});
});