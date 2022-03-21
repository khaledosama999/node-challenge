import { router as docsV1 } from './routes/v1-docs';
import { Router } from 'express';
import { router as v1 } from './routes/v1-get-user-expenses';

export const router = Router();

router.use('/v1', v1);
router.use('/v1', docsV1);
