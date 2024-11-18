import { Router } from 'express';
import ParkController from '../controllers/ParkController';

const router = Router();

router.get('/', ParkController.getNearestParks);

export default router;