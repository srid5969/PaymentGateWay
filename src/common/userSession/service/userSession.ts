import * as uuid from 'uuid'
import * as jsonwebtoken from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";
import {configurations} from "configuration/manager";
import {TokenModel} from "common/userSession/model/usersToken";


export class UserSessionService{


    public async generateRefreshToken():Promise<string>{
        return uuid.v4()
    }
    public async generateAccessToken(userData:any):Promise<string>{
        const payload:JwtPayload={
            user:userData._id|userData.user,
            exp:3600,
            iss:"innovix",
            sub:"accessToken"
        }
        return jsonwebtoken.sign(payload, configurations.jwtSecret)
    }
    public async saveToken(payload:any):Promise<any>{
      return   await new TokenModel(payload).save()
    }
    public async verifyAccessToken(token:string):Promise<any>{
        try {
            const decode=jsonwebtoken.verify(token, configurations.jwtSecret)
            if(decode){
                return decode
            }
            return false
        }catch (e) {
            return false
        }
    }
}