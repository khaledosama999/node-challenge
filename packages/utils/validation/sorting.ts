import Joi from 'joi';

export const order = Joi.number().valid(1, -1);
