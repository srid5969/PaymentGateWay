import { injectable } from "@leapjs/common";
import bcrypt from "bcrypt";
import { User ,UserModel} from "app/user/model/user";


@injectable()
export class UserService {
  helloWorld(): Promise<any> {
    return Promise.resolve({ message: "Hello World" });
  }
  public async userSignUp(data: User): Promise<User | any> {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    return new Promise<User | any>(async (resolve, reject) => {
      try {
        const Data = new UserModel(data);
        const saveUser = await Data.save();
        resolve(saveUser);
      } catch (error) {
        reject({ statusCode: 403, message: error });
      }
    });
  }
  public async sentOTP(phone: number): Promise<void> {
    let otp = 1234;
    console.log(otp);
  }
  public async checkUserPhoneNumber(phone: number): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const registeredUser = await UserModel.findOne({ phone: phone });
      if (registeredUser) {
        return resolve(true);
      }
      return resolve(false);
    });
  }
  public async forgotPassword() {}
}
