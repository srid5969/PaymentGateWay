import {HttpStatus, inject, injectable} from "@leapjs/common";
import {OTPService} from "app/otp/service/otp";
import {UserModel} from "app/user/model/user";
import {ResponseReturnType} from "common/response/responseTypes";
import {UserSessionService} from "common/userSession/service/userSession";
import {ObjectId} from "mongodb";

@injectable()
export class UserService {
	@inject(UserSessionService)
	private service!: UserSessionService;
	@inject(OTPService)
	private otpService!: OTPService;

	public async getUserDetailUsingId(_id: ObjectId): Promise<any> {
		return Promise.resolve(await UserModel.findOne({_id}));
	}

	//login
	public async login(phone: number): Promise<ResponseReturnType> {
		const user = await UserModel.findOne({phone}, {id: 1});

		if (!user) return await this.registeringMobile(phone);

		const data = await this.otpService.generateOTP(phone, user);
		return {
			code: HttpStatus.OK,
			data,
			error: null,
			message: "The otp has been sent successfully and the user verification is still pending",
			status: true
		};
	}
	public async registeringMobile(phone: number): Promise<ResponseReturnType | any> {
		try {
			const saveNumber = await new UserModel({
				phone,
				verified: false
			}).save();

			const token = await this.otpService.generateOTP(phone, saveNumber._id);
			return {
				code: 200,
				existingUser: false,
				message: "OTP has been successfully send",
				data: token,
				error: null,
				status: true
			};
		} catch (error) {
			return {
				code: HttpStatus.UNPROCESSABLE_ENTITY,
				message: "Trouble in paradise",
				error,
				data: null,
				status: false
			};
		}
	}

	public async verifyOTP(payload: any): Promise<ResponseReturnType> {
		const {otp, token} = payload;
		
		const user: ObjectId | boolean = await this.otpService.verifyOTP(otp, token);

		if (user) {
			const userData = await UserModel.findOneAndUpdate({_id: user}, {verified: true});
			const accessToken = await this.service.generateAccessToken(user);
			const refreshToken = await this.service.generateRefreshToken();
			await this.service.saveToken({
				refreshToken,
				user: userData._id
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
		return {
			code: HttpStatus.NOT_ACCEPTABLE,
			status: false,
			message: "Otp  cannot verified",
			error: null,
			data: null
		};
	}

	public async forgotPassword() {}
}
