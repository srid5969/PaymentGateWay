import {inject} from "@leapjs/common";
import {Middleware} from "@leapjs/router";
import {TokenModel, UsersToken} from "common/userSession/model/usersToken";
import {UserSessionService} from "common/userSession/service/userSession";
import {configurations} from "configuration/manager";
import {NextFunction, Response} from "express";
/**
 * @property - Bearer or Basic authorization token is used for authorization
 * @class : Authorization
 * @description The is an @OAuth 2.0 Authentication here the refresh and access token is given to the client
 * every time the client access the api the client access token in authorization header starting with basic or bearer
 *
 */
@Middleware()
export class AuthMiddleware {
	@inject(UserSessionService)
	private service!: UserSessionService;
	/**
	 * @param {*} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @return {*}  {Promise<any>}
	 * @phone_number_login direct access without authentication
	 * @memberof AuthMiddleware
	 */
	public async before(req: any, res: Response, next: NextFunction): Promise<any> {
		const signUp = configurations.apiPrefix || "" + "/user/signup";
		const verifyOtp = configurations.apiPrefix || "" + "/user/verify-otp";

		const login = configurations.apiPrefix || "" + "/user/login";
		const oauth = configurations.apiPrefix || "" + "/token/oauth";
		switch (req.originalUrl) {
			case signUp:
				next();
				break;
			case verifyOtp:
				next();
				break;
			case oauth:
				//generate access token using refresh token
				const refreshToken: string = req.body.refreshToken || req.body.refresh_token;
				const find: UsersToken | null = await TokenModel.findOneAndUpdate(
					{
						refreshToken: refreshToken,
						expired: false
					},
					{expired: true}
				);
				if (!find) {
					return res
						.json({
							code: 401,
							message: "Token is invalid",
							error: "Use valid refresh token",
							status: true
						})
						.status(401);
				}
				//generate accessToken
				const accessToken: string = await this.service.generateAccessToken(find);
				//generate refreshToken
				const generatedRefreshToken: string = await this.service.generateRefreshToken();

				//save refreshToken in database
				await this.service.saveToken({
					user: find.user,
					refreshToken: generatedRefreshToken
				});
				//send response to the user

				res
					.json({
						code: 200,
						refreshToken: generatedRefreshToken,
						accessToken
					})
					.status(200);

				break;
			case login:
				next();

				break;
			default:
				try {
					if (!req.headers.authorization) {
						return res
							.send({
								message: "authorization missing"
							})
							.status(401);
					}
					const token: string[] = req.headers.authorization.split(" ") || "";

					if (token[1]) {
						const decode = await this.service.verifyAccessToken(token[1]);

						if (!decode) {
							return res
								.json({
									code: 401,
									message: "Token is invalid",
									error: "Token cannot be verified",
									status: true
								})
								.status(401);
						}
						req.user = decode.user;
						return next();
					}
					return res
						.send({
							message: "no token found"
						})
						.status(401);
				} catch (error) {
					next(error);
				}
		}
	}
}
