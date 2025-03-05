import Joi from "joi";
import { IUser } from "./user.types";

export const UserSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "FirstName should be a type of text",
      "string.empty": "FirstName cannot be empty",
      "string.min": "FirstName should have a minimum length of 3",
      "string.max": "FirstName should have a maximum length of 30",
      "any.required": "FirstName is required",
    }),
  lastName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "LastName should be a type of text",
      "string.empty": "LastName cannot be empty",
      "string.min": "LastName should have a minimum length of 3",
      "string.max": "LastName should have a maximum length of 30",
      "any.required": "LastName is required",
    }),
  profileUrl: Joi.string()
    .allow(null, "")
    .optional()
    .uri()
    .messages({ "string.uri": "Profile URL must be a valid URL." }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "Email should be a type of text",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
  role: Joi.string()
    .valid("supAdmin", "admin", "user")
    .required()
    .messages({
      "any.only": 'Role must be either "admin" or "other"',
      "any.required": "Role is required",
    }),
  phone: Joi.string()
    .required()
    .messages({
      "string.base": "Phone should be a type of text",
      "string.empty": "Phone cannot be empty",
      "any.required": "Phone is required",
    }),
  phoneCode: Joi.string()
    .required()
    .messages({
      "string.base": "Phone code should be a type of text",
      "string.empty": "Phone code cannot be empty",
      "any.required": "Phone code is required",
    }),
  countryCode: Joi.string()
    .required()
    .messages({
      "string.base": "Country code should be a type of text",
      "string.empty": "Country code cannot be empty",
      "any.required": "Country code is required",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      ),
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must have at least 8 characters, including uppercase, lowercase, number, and special character",
      "any.required": "Password is required",
    }),
});

export const validateUser = (user: IUser) => {
  return UserSchema.validate(user);
};
