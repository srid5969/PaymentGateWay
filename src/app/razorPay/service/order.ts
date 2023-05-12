import { injectable } from "@leapjs/common";
import { razorPayInstance } from "configuration/razorPay/razorPayConfig";
import {Orders} from "razorpay/dist/types/orders";


@injectable()
export class RazorPayOrder {

    create(data: Orders.RazorpayOrderCreateRequestBody | Orders.RazorpayTransferCreateRequestBody | Orders.RazorpayAuthorizationCreateRequestBody): Promise<Orders.RazorpayOrder>{
       return razorPayInstance.orders.create(data)
    }
    fetchTransferOrder(orderId: string): Promise<Orders.RazorpayOrder>{
        return razorPayInstance.orders.fetchTransferOrder(orderId)
    }
    createOrder(data: Orders.RazorpayOrderCreateRequestBody | Orders.RazorpayTransferCreateRequestBody | Orders.RazorpayAuthorizationCreateRequestBody): Promise<Orders.RazorpayOrder>{
        return razorPayInstance.orders.create(data)
     }

}