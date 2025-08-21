import * as Joi from "joi";

export const createUserJoi: Joi.ObjectSchema = Joi.object({
	username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
	city: Joi.string().min(2).max(50).required(),
	date_of_birth: Joi.date().max('now').required(),
});

export const loginJoi: Joi.ObjectSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const createAccountJoi: Joi.ObjectSchema = Joi.object({
	user_id: Joi.number().integer().positive().required(),
	type: Joi.string().valid('savings', 'checking').required(),
	initial_balance: Joi.number().positive().default(0),
});

export const updateAccountStatusJoi: Joi.ObjectSchema = Joi.object({
	status: Joi.string().valid('active', 'frozen', 'closed').required(),
});

export const createTransactionJoi: Joi.ObjectSchema = Joi.object({
	from_account_id: Joi.number().integer().positive().optional(),
	to_account_id: Joi.number().integer().positive().optional(),
	amount: Joi.number().positive().required(),
	type: Joi.string().valid('deposit', 'withdrawal', 'transfer').required(),
	description: Joi.string().min(1).max(500).required(),
});

export const updateUserJoi: Joi.ObjectSchema = Joi.object({
	username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).optional(),
	email: Joi.string().email().optional(),
});

export const userIdJoi: Joi.ObjectSchema = Joi.object({
	id: Joi.number().integer().positive().required(),
});

export const validateRequest = (schema: Joi.ObjectSchema, data: any) => {
	const { error, value } = schema.validate(data, {
		abortEarly: false,
		stripUnknown: true,
		allowUnknown: false
	});

	if (error) {
		const errors = error.details.map(detail => ({
			field: detail.path.join('.'),
			message: detail.message,
			value: detail.context?.value
		}));

		throw {
			statusCode: 400,
			message: 'Validation failed',
			errors
		};
	}

	return value;
}; 