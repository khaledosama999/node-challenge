import _ from 'lodash';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
/**
 * A higher order function that generates a middleware that validates the incoming request
 * against the given schema
 *
 * @param {Object} args
 *
 * @param {Object} [args.paramsSchema]
 * @param {Object} [args.bodySchema]
 * @param {Object} [args.querySchema]
 *
 * @returns {RequestHandler}
 */
export function validationMiddleWareGenerator(args: {
    paramsSchema?: Joi.ObjectSchema
    bodySchema?: Joi.ObjectSchema
    querySchema?: Joi.ObjectSchema
}) {
  const {
    paramsSchema,
    bodySchema,
    querySchema,
  } = args;

  let compiledParamsSchema: Joi.Schema;
  let compiledBodySchema: Joi.Schema;
  let compiledQuerySchema: Joi.Schema;

  if (!_.isNil(paramsSchema)) {
    compiledParamsSchema = Joi.compile(paramsSchema);
  }

  if (!_.isNil(bodySchema)) {
    compiledBodySchema = Joi.compile(bodySchema);
  }

  if (!_.isNil(querySchema)) {
    compiledQuerySchema = Joi.compile(querySchema);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    // Validate every incoming input against it's appropriate schema

    const errors = [];

    if (compiledParamsSchema) {
      const paramsValidation = compiledParamsSchema.validate(req.params);
      req.params = paramsValidation.value;

      if (paramsValidation.error) {
        // We can have a helper function that parses the Joi errors here
        errors.push(...paramsValidation.error.details.map((detail) => detail.message));
      }
    }

    if (compiledBodySchema) {
      const bodyValidation = bodySchema.validate(req.body);
      req.body = bodyValidation.value;

      if (bodyValidation.error) {
        errors.push(bodyValidation.error);

        errors.push(...bodyValidation.error.details.map((detail) => detail.message));
      }
    }

    if (compiledQuerySchema) {
      const queryValidation = compiledQuerySchema.validate(req.query);
      req.query = queryValidation.value;

      if (queryValidation.error) {
        errors.push(queryValidation.error);
        errors.push(...queryValidation.error.details.map((detail) => detail.message));
      }
    }

    // If the errors array isn't not empty we need to report back an error
    if (!_.isEmpty(errors)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    }

    next();
  };
}
