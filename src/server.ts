import "module-alias/register";
import "reflect-metadata";
import {Logger, expandObject} from "@leapjs/common";
import bootstrap from "app/app";
import {isValid} from "configuration/helpers";
import {configurations as configuration} from "configuration/manager";

function main(): void {
	configuration
		.init()
		.then((): any => {
			Logger.log(`Setting up environment`, "ConfigurationManager");
			return isValid(configuration);
		})
		.then(async (): Promise<any> => {
			Logger.log(`Initializing settings`, "ConfigurationManager");
			Logger.log(`Connecting to the database`, "LeapApplication");
			Logger.log(`Starting server on ${configuration.port}`, "LeapApplication");
			await bootstrap(configuration);
			Logger.log(`Up and running`, "LeapApplication");
		})
		.catch((error: any): void => {
			Logger.error(expandObject(error), "", "LeapApplication");
			process.exit(0);
		});
}

process.on("uncaughtException", (error): void => {
	Logger.error(expandObject(error), "", "LeapApplication");
	process.exit(1);
});

process.on("unhandledRejection", (error): void => {
	Logger.error(expandObject(error), "", "LeapApplication");
	process.exit(1);
});

main();
