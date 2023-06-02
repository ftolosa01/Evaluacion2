import register from '../../src/logic/register.logic.js';
import UserModel from '../../src/models/user.model.js';
import { getCriminalRecords } from '../../src/services/registro-civil.service.js';
import { HTTPError } from '../../src/helpers/error.helper.js';
import { sendEmail } from '../../src/services/notification.service.js';
import registerMessages from '../../src/messages/register.messages.js';

jest.mock('../../src/services/notification.service.js');
jest.mock('../../src/models/user.model.js');
jest.mock('../../src/services/registro-civil.service.js');

describe("register logic", () => {

    it('[Susseful] Create a new user and save in database', async () => {
        const user = {
            _id: "123",
            email: "test@example.com",
            password: "password",
            rut:"12345679"
        };

        sendEmail.mockResolvedValue(null)

        getCriminalRecords.mockResolvedValue(true);
        UserModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
        UserModel.prototype.save.mockResolvedValue(user);

        const response = await register(user);

        expect(getCriminalRecords).toHaveBeenCalledWith(user.rut);
        expect(UserModel.prototype.save).toHaveBeenCalledWith();
        expect(response).toBe(user._id);

    }); 

    it('[ERROR] user already exists in the database with email', async () => {
        const user = {
            email: "test@example.com",
            rut: "123456789",
        };
        const founduser = {
            email: "test@example.com",
        };

        getCriminalRecords.mockResolvedValue(true);
		UserModel.findOne.mockReturnValue({
			exec: jest.fn().mockResolvedValue(founduser),
		});

        const HttpErrror = new HTTPError({
			name: registerMessages.alreadyExists.name,
			msg: registerMessages.alreadyExists.messages.email,
			code: 400,
		});
        const response = register(user);

        await expect(response).rejects.toThrow(HttpErrror);

    }); 

    it('[ERROR] user already exists in the database with rut', async () => {
        const user = {
            email: "test@example.com",
            rut: "123456789",
        };
        const founduser = {
            rut: "123456789",
        };

        getCriminalRecords.mockResolvedValue(true);
		UserModel.findOne.mockReturnValue({
			exec: jest.fn().mockResolvedValue(founduser),
		});

        const HttpErrror = new HTTPError({
			name: registerMessages.alreadyExists.name,
			msg: registerMessages.alreadyExists.messages.rut,
			code: 400,
		});
        const response = register(user);

        await expect(response).rejects.toThrow(HttpErrror);

    }); 



});