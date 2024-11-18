import { Router } from 'express';
import TestController from '../controllers/TestController';

const router = Router();

router.get('/redis', TestController.testRedis);
router.get('/mongodb', TestController.testMongoDB);
router.get('/mysql', TestController.testMySQL);

export default router;
