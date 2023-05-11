import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { User } from "app/user/model/user";
import { IsDefined } from "class-validator";
import { ObjectId } from "mongodb";
@index({ id: 1 }, { expires: "365" })
class UsersToken {
  @prop()
  public id!: ObjectId;

  @prop({ ref: User })
  @IsDefined({ groups: ["create"] })
  public user!: Ref<User> | ObjectId;

  @prop()
  @IsDefined({ groups: ["create"] })
  public refreshToken!: string;

  @prop({ default: false })
  public expired: boolean = false;
}

const TokenModel = getModelForClass(UsersToken, {
  schemaOptions: {
    collection: "userSession",
    versionKey: false,
    timestamps: { createdAt: "createdAt" }
  }
});
export { UsersToken, TokenModel };
