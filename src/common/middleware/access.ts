import {Middleware, UseBefore} from "@leapjs/router";
import {NextFunction, Response} from "express";
import {TokenModel, UsersToken} from "common/userSession/model/usersToken";
import {inject} from "@leapjs/common";
import {UserSessionService} from "common/userSession/service/userSession";
import Authentication from "./auth";

@UseBefore(Authentication)
@Middleware()
export class AuthMiddleware {
	@inject(UserSessionService)
	private service!: UserSessionService;

    @UseBefore(Authentication)
	public async before(
		req: any,
		res: Response,
		next: NextFunction
	): Promise<any> {
		switch (req.originalUrl) {
			case "/user/signup":
				//no need of authentication
				next();
				break;

			case "/token/oauth":
				//generate access token using refresh token
				const refreshToken: string =
					req.body.refreshToken || req.body.refresh_token;
				const find: UsersToken = await TokenModel.findOne({
					refreshToken: refreshToken
				});
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
				const accessToken: string = await this.service.generateAccessToken(
					find
				);
				//generate refreshToken
				const generatedRefreshToken: string =
					await this.service.generateRefreshToken();

				//save refreshToken in database
				const save = await this.service.saveToken({
					user: find.user,
					refreshToken: generatedRefreshToken
				});
				console.log(save);
				//send response to the user

				res
					.json({
						code: 200,
						refreshToken: generatedRefreshToken,
						accessToken
					})
					.status(200);

				break;
			case "/user/login":
				next();

				break;
			default:
                try {
                    if(!req.headers.authorization){
                        return res.send({
                            message:"authorization missing"
                        }).status(401)
                    }
                    const token: string[] =  req.headers.authorization.split(" ") || "";
                    if(token[1]){
				const decode = await this.service.verifyAccessToken(token[1]);
				if (!decode) {
					return res
						.json({
							code: 401,
							message: "Token is invalid",
							error: "Use valid refresh token",
							status: true
						})
						.status(401);
				}
				req.user = decode.user;
				return next();}
                return res.send({
                    message:"no token found"
                }).status(401)
                } catch (error) {
                    next(error)
                }
				
		}
	}
}
