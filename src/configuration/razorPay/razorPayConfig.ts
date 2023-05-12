import Razorpay from "razorpay";

//RazorPayInstance
export class RazorpayConfig {
	key_id!: string;
	key_secret!: string;
}

const config = {
	key_id: process.env.RAZOR_PAY_KEY_ID || "value",
	key_secret: process.env.RAZOR_PAY_KEY_SECRET || ""
};
export const razorPayInstance = new Razorpay(config);
