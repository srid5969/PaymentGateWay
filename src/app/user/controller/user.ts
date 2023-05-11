import { HttpStatus, inject } from "@leapjs/common";
import { Controller, Get, Post, Req, Res } from "@leapjs/router";
import { Request, Response } from "express";
import { UserService } from "../service/user";

@Controller("/user")
export class UserController {
  @inject(() => UserService) userService!: UserService;
  @Get("/")
  public async helloWorld(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    // Logger
    return new Promise<Response>(async (resolve) => {
      resolve(res.json(await this.userService.helloWorld()));
    });
  }
  @Post("/login")
  public login(@Req() req: Request, @Res() res: Response): void {
    
  }
  @Post("/signup")
  public async signUp(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    return new Promise<Response>((resolve) => {
      return this.userService
        .userSignUp(req.body)
        .then((result) => {
          return resolve(res.status(HttpStatus.OK).send(result));
        })
        .catch((err) => {
          return resolve(res.status(HttpStatus.CONFLICT).json(err));
        });
    });
  }
}
