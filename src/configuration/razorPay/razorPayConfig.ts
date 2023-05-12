import { configurations } from 'configuration/manager';
import Razorpay from "razorpay";


//RazorPayInstance
export class RazorpayConfig{
  key_id!:string
  key_secret!:string
}

const config={
    key_id: configurations.razorPay.key_id,
    key_secret: configurations.razorPay.key_secret,
  }
export const razorPayInstance = new Razorpay(config) 