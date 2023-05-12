import { HttpStatus, inject } from "@leapjs/common";
import { Body, Controller, Get, Param, Post, Res } from "@leapjs/router";
import { Response } from "express";
import { TransactionService } from "../service/transaction";

@Controller("/orders")
export class OrderController {
	@inject(TransactionService)
	transactionService!: TransactionService;
	@Post("/pay")
	public async postRequest(@Body() body: any, @Res() res: Response): Promise<Response> {
		try {
			const data = await this.transactionService.placeOrder(body);
			return data.code ? res.status(data.code).json(data) : res.status(HttpStatus.ACCEPTED).send(data);
		} catch (error: any) {
			return error.code ? res.status(error.code).json(error) : res.status(HttpStatus.CONFLICT).send(error);
		}
	}

	@Get("/orderId/:orderId")
	public async getFullPaymentDetails(@Param("orderId") orderId: string, @Res() res: Response): Promise<Response> {
		try {
			const data = await this.transactionService.getTransactionDetailByOrderId(orderId);
			return data.code ? res.status(data.code).json(data) : res.status(HttpStatus.ACCEPTED).send(data);
		} catch (error: any) {
			return error.code ? res.status(error.code).json(error) : res.status(HttpStatus.CONFLICT).send(error);
		}
	}
}
