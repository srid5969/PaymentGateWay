import {prop, getModelForClass} from "@typegoose/typegoose";
import {Expose} from "class-transformer";
import {IsAlpha, IsDefined, IsPhoneNumber, IsEnum} from "class-validator";
import {Roles} from "common/constants";
import {ObjectId} from "mongodb";
import {EMPTY_PHONE} from "resources/strings/app/auth";
import {INVALID_NAME} from "resources/strings/app/role";
import {
	INVALID_FIRST_NAME,
	EMPTY_FIRST_NAME,
	INVALID_PHONE
} from "resources/strings/app/user";

class User {
	@prop({_id: true, id: ObjectId})
	public _id?: ObjectId;

	@prop({required: true, default: "Pending"})
	@IsAlpha("en-US", {groups: ["create"], message: INVALID_FIRST_NAME})
	@IsDefined({groups: ["create"], message: EMPTY_FIRST_NAME})
	public name?: string;

	@prop({required: true, unique: true})
	@IsDefined({groups: ["login"], message: EMPTY_PHONE})
	@IsPhoneNumber("IN", {message: INVALID_PHONE})
	public phone!: number;

	@prop({required: true, default: Roles.Employee})
	@Expose({groups: ["admin"]})
	@IsEnum(Roles, {groups: ["create", "update"], message: INVALID_NAME})
	public role!: string;

    
	@prop({required: true, allowMixed: 0})
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
