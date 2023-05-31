import { expect, jest } from "@jest/globals";
import UserModel from "../../src/models/user.model";

descrive("Logic: verify", () => {
    jest.spyOn(UserModel, "save").mockReturnValue();

    it("[ERROR] Should throw an error when Extact the verify code from token", async () => {
        

	});

    it("[ERROR] Should throw an error when the user is already verified", async () => {
        

	});

    
    it("[ERROR] Should throw an error when the code string from user document exists", async () => {
        

	});

});