import { EXPENSES_SORT_KEYS, EXPENSES_STATUS } from '../types';

export default {
  '/get-user-expenses': {
    get: {
      tags: ['Expenses'],
      summary: 'get user expenses by id',
      operationId: 'getUserExpenses',
      produces: ['application/json'],
      parameters: [
        {
          name: 'userId',
          in: 'query',
          required: true,
          type: 'string',
          example: '3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
        },
        {
          name: 'status',
          in: 'query',
          type: 'string',
          example: 'processed',
          enum: Object.values(EXPENSES_STATUS),
        },
        {
          name: 'startDate',
          in: 'query',
          type: 'date',
          example: '10-10-2022',
          description: 'The start date is inclusive',
        },
        {
          name: 'endDate',
          in: 'query',
          type: 'date',
          example: '10-10-2022',
          description: 'The end date is exclusive',
        },
        {
          name: 'sortBy',
          in: 'query',
          type: 'string',
          example: 'created_at',
          enum: Object.values(EXPENSES_SORT_KEYS),
        },
        {
          name: 'order',
          in: 'query',
          type: 'number',
          enum: [-1, 1],
          description: '-1 is descending 1 is ascending',
        },
        {
          name: 'limit',
          in: 'query',
          type: 'number',
          default: 25,
          minimum: 1,
          maximum: 50,
          example: 2,
        },
        {
          name: 'page',
          in: 'query',
          type: 'number',
          default: 1,
          minimum: 1,
        },
      ],
      responses: {
        200: {
          description: 'successful operation',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['pagination', 'expenses'],
                properties: {
                  expenses: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: [
                        'id',
                        'merchant_name',
                        'amount_in_cents',
                        'currency',
                        'user_id',
                        'date_created',
                        'status',
                      ],
                      properties: {
                        id: {
                          type: 'string',
                          example: ' 3e920f54-49df-4d0b-b11b-e6f08e3a2dca',
                        },
                        merchant_name: {
                          type: 'string',
                          example: 'Cafe',
                        },
                        amount_in_cents: {
                          type: 'number',
                          example: 22,
                        },
                        currency: {
                          type: 'string',
                          example: 'DKK',
                        },
                        user_id: {
                          type: 'string',
                          example: 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474',
                        },
                        date_created: {
                          type: 'string',
                          example: '2021-09-21',

                        },
                        status: {
                          type: 'string',
                          example: 'pending',
                        },
                      },
                    },
                  },
                  pagination: {
                    type: 'object',
                    required: ['totalCount', 'page'],
                    properties: {
                      totalCount: {
                        type: 'number',
                        description: 'Total number of records that match',
                        example: 25,
                      },
                      pages: {
                        type: 'number',
                        description: 'Total number of pages for the given limit and filter',
                        example: 1,
                      },
                    },
                  },
                },
              },
            },
          },

        },
        400: {
          description: 'BadRequest Error',
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    },
  },
};
