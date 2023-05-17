import * as uuid from "uuid";
import * as jsonwebtoken from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";
import {configurations} from "configuration/manager";
import {TokenModel} from "common/userSession/model/usersToken";

export class UserSessionService {
	public async generateRefreshToken(): Promise<string> {
		return uuid.v4();
	}
	public async generateAccessToken(userData: any): Promise<string> {
		const payload: JwtPayload = {
			user: userData._id || userData.user,
			exp: Date.now() + 60 * 60 * 24,
			iat: Date.now(),
			iss: "british-empire",
			sub: "access_token"
		};
		const token = jsonwebtoken.sign(payload, configurations.jwtSecret);
		return token;
	}
	public async saveToken(payload: any): Promise<any> {
		return await new TokenModel(payload).save();
	}
	public async verifyAccessToken(token: string): Promise<any> {
		try {
			const decode = await jsonwebtoken.verify(token, configurations.jwtSecret);

			if (decode) {
				return decode;
			}
			return false;
		} catch (e) {
			return false;
		}
	}
}
