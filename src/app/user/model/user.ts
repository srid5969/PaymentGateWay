import {getModelForClass, prop} from "@typegoose/typegoose";
import {Expose} from "class-transformer";
import {IsAlpha, IsDefined, IsEnum, IsPhoneNumber} from "class-validator";
import {Roles} from "common/constants";
import {ObjectId} from "mongodb";
import {EMPTY_PASSWORD, EMPTY_PHONE} from "resources/strings/app/auth";
import {INVALID_NAME} from "resources/strings/app/role";
import {EMPTY_NAME, INVALID_PHONE} from "resources/strings/app/user";

class User {
	@prop({_id: true, id: ObjectId})
	public id?: ObjectId;

	@prop({required: true, default: "Pending"})
	@IsAlpha("en-US", {groups: ["create"], message: INVALID_NAME})
	@IsDefined({groups: ["create"], message: EMPTY_NAME})
	public name?: string;

	@prop({required: true, unique: true})
	@IsDefined({groups: ["login"], message: EMPTY_PHONE})
	@IsDefined({groups: ["create"], message: EMPTY_PHONE})
	@IsPhoneNumber("IN", {message: INVALID_PHONE})
	public phone!: number;

	@prop({required: true, default: Roles.Employee})
	@Expose({groups: ["admin"]})
	@IsEnum(Roles, {groups: ["create", "update"], message: INVALID_NAME})
	public role!: string;

	@prop({required: true, allowMixed: 0})
	@IsDefined({groups: ["create"], message: EMPTY_PASSWORD})
	public password!: string;
}

const UserModel = getModelForClass(User, {
	schemaOptions: {
		collection: "users",
		versionKey: false,
		timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"}
	}
});
export {User, UserModel};
