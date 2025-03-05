import Joi from "joi";

const PersonalInformationSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  dob: Joi.date().required(),
  address: Joi.string().min(1).required(),
});

const AcademicAchievementsSchema = Joi.object({
  achievements: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      year: Joi.number().required(),
      description: Joi.string().optional(),
    }),
  ),
});

const AthleticPerformanceSchema = Joi.object({
  sports: Joi.array().items(
    Joi.object({
      sportName: Joi.string().required(),
      performanceLevel: Joi.string().required(),
      achievements: Joi.string().optional(),
    }),
  ),
});

const DocumentUploadsSchema = Joi.object({
  documents: Joi.array().items(
    Joi.object({
      docName: Joi.string().required(),
      uploadDate: Joi.date().required(),
      url: Joi.string().uri().required(),
    }),
  ),
});

export const UserSchema = Joi.object({
  username: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  cpassword: Joi.string()
    .min(6)
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Passwords must match",
    }),
  role: Joi.string().valid("superAdmin", "admin", "player", "coach").required(),
  subscriptionId: Joi.string().optional(),
  personalInformationId: PersonalInformationSchema.optional(),
  academicAchievementsId: AcademicAchievementsSchema.optional(),
  athleticPerformanceId: AthleticPerformanceSchema.optional(),
  documents: DocumentUploadsSchema.optional(),
});
