import Razorpay from "razorpay";
import dotenv from 'dotenv';

if (dotenv.config().error) {
	throw new Error("Cannot find configuration file");
}
//RazorPayInstance
export class RazorpayConfig {
	key_id!: string;
	key_secret!: string;
}

const config = {
	key_id: process.env.RAZOR_PAY_KEY_ID || "rzp_test_6NKMSxNWLW1ph9",
	key_secret: process.env.RAZOR_PAY_KEY_SECRET || "secretKey"
};
export const razorPayInstance = new Razorpay(config);
