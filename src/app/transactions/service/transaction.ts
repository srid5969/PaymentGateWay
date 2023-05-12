import {HttpStatus, inject, injectable} from "@leapjs/common";
import {TransactionModel, Transactions} from "../model/transactionsDTO";
import {ResponseReturnType} from "common/response/responseTypes";
import {RazorPayOrder} from "app/razorPay/service/order";
import {Orders} from "razorpay/dist/types/orders";

@injectable()
class TransactionService {
	@inject(RazorPayOrder)
	razorPay!: RazorPayOrder;
	public async makePayment(payload: Transactions): Promise<ResponseReturnType> {
		return new Promise<ResponseReturnType>(async (resolve) => {
			try {
				const transaction = new TransactionModel(payload);

				const saveTransaction = await transaction.save();

				resolve({
					code: HttpStatus.OK,
					data: saveTransaction,
					error: null,
					message: "Successfully saved",
					status: true
				});
			} catch (error) {
				resolve({
					code: HttpStatus.NOT_ACCEPTABLE,
					data: null,
					error: error,
					message: "Cannot save the transaction",
					status: false
				});
			}
		});
	}
	public async getTransactionDetailByOrderId(orderId: string): Promise<ResponseReturnType>  {
		const result = await this.razorPay.fetchTransferOrder(orderId);
		return {
			data: result,
			error: null,
			status: true,
			message: "Success",
			code: 200
		};
	}

	public async placeOrder(data: Orders.RazorpayOrderCreateRequestBody): Promise<ResponseReturnType> {
		const result = await this.razorPay.createOrder(data);
		return {
			data: result,
			error: null,
			status: true,
			message: "Success",
			code: 200
		};
	}
}
export {TransactionService};
