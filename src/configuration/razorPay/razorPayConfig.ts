import {IRazorpayConfig} from "razorpay";
import {RazorpayHeaders} from "razorpay/dist/types/api";

export class RazorpayConfig implements IRazorpayConfig {
	public key_id!: string;
	public key_secret?: string | undefined;
	public headers?: RazorpayHeaders | undefined;
}
