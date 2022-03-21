import Joi from 'joi';

export const limit = Joi.number().max(50).min(1).default(25);
export const page = Joi.number().min(1);
