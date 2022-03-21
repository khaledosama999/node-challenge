import expenseDocs from '../docs';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

export const router = Router();

// Only add docs in dev environments
if (process.env.ENV === 'development') {
  router.use('/docs', swaggerUi.serve);
  router.get('/docs', swaggerUi.setup(expenseDocs));
}
