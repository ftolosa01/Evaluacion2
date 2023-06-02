import verify from "../../src/controllers/verify.controller.js";
import { expect, jest } from "@jest/globals";
import { HTTPError } from "../../src/helpers/error.helper.js";
import verifyMessages from "../../src/messages/verify.messages.js";
import * as verifyLogic from "../../src/logic/verify.logic.js";

describe("Controller: verify", () => {
	const verifyLogicStub = jest.spyOn(verifyLogic, "default");
	const defaultReq = {
		body: {
			code: "12345"
		},
	};

	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

    it("[ERROR] Should throw an error when the code doesn't exists in the body", async () => {
		const req = {
			body: {
				code: "",
			},
		};

		const httpError = new HTTPError({
			name: verifyMessages.validation.name,
			msg: verifyMessages.validation.messages.code,
			code: 400,
		});

		await verify(req, res);
		expect(res.status).toBeCalledWith(400);
		expect(res.json).toBeCalledWith({ error: { ...httpError } });

	});

	it("[SUCCESS] Should return a 200 when verifyLogic return the code", async () => {
		const code = "12345";

		verifyLogicStub.mockResolvedValue({code});

		await verify(defaultReq, res);
		expect(res.status).toBeCalledWith(200);
		expect(verifyLogicStub).toBeCalledWith({
			code: defaultReq.body.code
		});
	});

	



	

 });