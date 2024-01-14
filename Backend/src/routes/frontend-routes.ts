import express, { Request, Response } from 'express';
import {
  getLatestBodyTemperature,
  getLatestHearthRate,
  getLatestBloodSaturation,
  getLatestBodyWeight,
  getLatestRespirationRate,
  getLatestBloodPressure,
  getAllBloodPressureData,
  getAllBloodSaturationData,
  getAllBodyTemperatureData,
  getAllBodyWeightData,
  getAllHearthRateData,
  getAllRespirationRateData,
} from '../controllers/frontend-controller';

const router = express.Router();

router.get('/latest-body-temperature', getLatestBodyTemperature);
router.get('/latest-hearth-rate', getLatestHearthRate);
router.get('/latest-blood-saturation', getLatestBloodSaturation);
router.get('/latest-body-weight', getLatestBodyWeight);
router.get('/latest-respiration-rate', getLatestRespirationRate);
router.get('/latest-blood-pressure', getLatestBloodPressure);
router.get('/all-data-body-temperature', getAllBodyTemperatureData);
router.get('/all-data-blood-saturation', getAllBloodSaturationData);
router.get('/all-data-hearth-rate', getAllHearthRateData);
router.get('/all-data-body-weight', getAllBodyWeightData);
router.get('/all-data-respiration-rate', getAllRespirationRateData);
router.get('/all-data-blood-pressure', getAllBloodPressureData);


export default router;
