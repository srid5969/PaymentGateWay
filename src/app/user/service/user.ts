import {HttpStatus, inject, injectable} from "@leapjs/common";
import bcrypt from "bcrypt";
import {User, UserModel} from "app/user/model/user";
import {ResponseReturnType} from "common/response/responseTypes";
import {UserSessionService} from "common/userSession/service/userSession";
import { ObjectId } from "mongodb";

@injectable()
export class UserService {
	@inject(UserSessionService)
	private service!: UserSessionService;

	public async getUserDetailUsingId(_id:ObjectId): Promise<any> {
		return Promise.resolve(await UserModel.findOne({_id}))
	}

	//login
	public async login(
		phone: string,
		password: string
	): Promise<ResponseReturnType> {
		const user = await UserModel.findOne({phone}, {password: 1});
		if (!user) {
			return {
				code: HttpStatus.NOT_FOUND,
				message: "user cannot be found",
				error: "unknown user",
				data: null,
				status: true
			};
		}
		const accessToken = await this.service.generateAccessToken(user);
		const refreshToken = await this.service.generateRefreshToken();
		await this.service.saveToken({
			refreshToken,
			user: user._id
		});
		return {
			code: 200,
			status: true,
			message: "Welcome",
			data: {
				refreshToken,
				accessToken
			},
			error: null
		};
	}

	public async userSignUp(data: User): Promise<User | any> {
		const salt = await bcrypt.genSalt(10);
		data.password = await bcrypt.hash(data.password, salt);
		return new Promise<User | any>(async (resolve, reject) => {
			try {
				const Data = new UserModel(data);
				

				const saveUser = await Data.save();

				resolve(saveUser);
			} catch (error) {
				console.log(error);

				reject({statusCode: 403, message: error});
			}
		});
	}
	public async sentOTP(phone: number): Promise<void> {
		let otp = 1234;
		console.log(otp);
	}
	public async checkUserPhoneNumber(phone: number): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			const registeredUser = await UserModel.findOne({phone: phone});
			if (registeredUser) {
				return resolve(true);
			}
			return resolve(false);
		});
	}
	public async forgotPassword() {}
}
