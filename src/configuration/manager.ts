import {RazorpayConfig} from "configuration/razorPay/razorPayConfig";

import {LeapApplication} from "@leapjs/core";
import dotenv from "dotenv";
import Database from "./database/config";

class Configuration {
	public env = "development";
	public name?: string = "Leap";
	public database!: Database;
	public port?: number = 8080;
	public jwtSecret!: string;
	public razorPay!: RazorpayConfig;
	public application!: LeapApplication;
	public corsWhitelistedDomains = "*";
	public apiPrefix: string = "";

	constructor() {
		this.razorPay = new RazorpayConfig();
		this.database = new Database();
		this.razorPay.key_id = process.env.RAZOR_PAY_KEY_ID || "";
		this.razorPay.key_secret = process.env.RAZOR_PAY_KEY_SECRET || "";
	}
	public setContext(application: LeapApplication): void {
		this.application = application;
	}
	public async init(): Promise<string> {
		if (dotenv.config().error) {
			throw new Error("Cannot find configuration file");
		}
		this.database.host = process.env.MONGODB_HOST || "";
		this.database.name = process.env.MONGODB_DATABASE || "";
		this.name = process.env.NAME || this.name;
		this.port = Number(process.env.PORT) || this.port;
		this.env = process.env.NODE_ENV || this.env;
		this.razorPay.key_id = process.env.RAZOR_PAY_KEY_ID || "";
		this.razorPay.key_secret = process.env.RAZOR_PAY_KEY_SECRET || "";
		this.jwtSecret = process.env.JWT_SECRET_KEY || "";
		this.apiPrefix = process.env.API_PREFIX || "";
		return "Success";
	}
}
const configurations = new Configuration();
export {configurations, Configuration};
