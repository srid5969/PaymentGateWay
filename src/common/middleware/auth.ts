import { HttpStatus } from "@leapjs/common";
import { Middleware } from "@leapjs/router";
import { configurations } from "configuration/manager";
import { NextFunction, Response } from "express";
import { Jwt, JwtPayload, verify } from "jsonwebtoken";
import { AUTH_TOKEN_INVALID } from "./../../resources/strings/middleware/authentication";

@Middleware()
class Authentication {
	public async before(
		req: any,
		res: Response,
		next: NextFunction
	): Promise<any> {
		if (!req.headers.authorization) {
			return res
				.status(404)
				.json({message: "Token Not Found", status: "Failed"});
		}

		let token: any = req.headers.authorization.split(" ") || "";
		try {
			if (token[1]) {
				const user: Jwt | JwtPayload | string = await verify(token[1], configurations.jwtSecret || "");
				if (user) {
					req.user = user

					return next();
				}
				return res.json({message: AUTH_TOKEN_INVALID});
			} else {
				return res
					.status(404)
					.json({message: "Bearer Token Not Found", status: "Failed"});
			}
		} catch (error) {
			return res
				.status(HttpStatus.UNAUTHORIZED)
				.json({message: "Unauthorized token", status: "Failed"});
		}
	}
}

export default Authentication;
