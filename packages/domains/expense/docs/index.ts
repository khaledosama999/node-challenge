import getUserExpenses from './v1-get-user-expenses';

export default {
  swagger: '3.0',
  openapi: '3.0.0',
  info: {
    description: 'Expenses Domain API documentation',
    version: '1.0.0',
    title: 'Expenses',
    termsOfService: 'http://swagger.io/terms/',
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  schemes: [
    'https',
    'http',
  ],
  tags: [{ name: 'Expenses', description: 'Expenses endpoints' }],
  paths: {
    ...getUserExpenses,
  },
};
