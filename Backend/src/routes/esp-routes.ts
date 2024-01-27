import express, { Request, Response } from 'express';
import { handleTemperatureSensor, handlePulsSensor, handleSaturationSensor } from '../controllers/esp-controller';

const router = express.Router();

router.post('/temperature-sensor', async (req: Request, res: Response) => {
  await handleTemperatureSensor(req, res);
});

router.post('/puls-sensor', async (req: Request, res: Response) => {
  await handlePulsSensor(req, res);
});

router.post('/saturation-sensor', async (req: Request, res: Response) => {
  await handleSaturationSensor(req, res);
});

export default router;

