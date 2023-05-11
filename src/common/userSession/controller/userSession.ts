import { Controller, Get, Res } from "@leapjs/router";
import {  Response } from "express";


@Controller("/token")
export class AccessTokenGeneratorForRefreshToken{
     @Get('/oauth')
    public async getRequest( @Res() res: Response): Promise<Response> {
    return res.send('Hello world')
    }

}