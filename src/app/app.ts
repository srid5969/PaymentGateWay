import {acFilterAttributes} from "@leapjs/access-control";
import {LeapApplication, MongoDB} from "@leapjs/core";
import {ExpressAdapter} from "@leapjs/router";
import {AuthMiddleware} from "common/middleware/access";
import {AccessTokenGeneratorForRefreshToken} from "common/userSession/controller/userSession";
import {Configuration, configurations} from "configuration/manager";
import {json} from "express-mung";
import helmet from "helmet";
import {UserController} from "app/user/controller/user";
import morgan from "morgan";
import ErrorHandler from "common/Handle-Error/error-handler";
import mongoose from "mongoose";
import { Logger } from "@leapjs/common";


export default async function bootstrap(
	configuration: Configuration,
	listen = true
): Promise<void> {
	const application: LeapApplication = new LeapApplication();

	mongoose.connect(configurations.database.host || "", {
		dbName: configurations.database.name || "",
	  });
  
	  const database = mongoose.connection;
	  database.on("error", (error) => console.error());
	  database.once("connected", () => Logger.log(`Connected to the database`, "LeapApplication"));
  
	const server = application.create(new ExpressAdapter(), {
		prefix: configuration.apiPrefix || "",
		corsOptions: {
			origin: configuration.corsWhitelistedDomains,
			credentials: true
		},
		controllers: [AccessTokenGeneratorForRefreshToken, UserController],
		beforeMiddlewares: [
			helmet(),
			json(acFilterAttributes),
			AuthMiddleware,
			morgan("dev")
		],
		afterMiddlewares: [ErrorHandler]
	});
	// application.connectToDatabase(
	// 	new MongoDB(configuration.database.host, configuration.database.name)
	// );
	await new MongoDB(configuration.database.host, configuration.database.name).connect()
	server.listen(configuration.port);
}
