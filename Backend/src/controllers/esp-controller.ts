import { Request, Response } from 'express';
import BodyTemperatureModel from '../models/body-temperature-model';
import HearthRateModel from '../models/heart-rate-model';
import BloodSaturationModel from '../models/blood-saturation-model';

export const handleTemperatureSensor = async (req: Request, res: Response) => {
  try {
    const dataBodyTemperature = req.body;
    console.log('Received Temperature data:', dataBodyTemperature);

    const BodyTemperatureEntry = new BodyTemperatureModel({
      value: dataBodyTemperature.temperature,
    });

    await BodyTemperatureEntry.save();

    res.status(200).send('POST request received by the server.');
  } catch (error) {
    console.error('Error while saving data:', error);
    res.status(500).send('Error while saving data.');
  }
};

export const handlePulsSensor = async (req: Request, res: Response) => {
  try {
    const dataHearthRate = req.body;
    console.log('Received HearthRate data:', dataHearthRate);

    const HearthRateEntry = new HearthRateModel({
      value: dataHearthRate.heartbeat,
    });

    await HearthRateEntry.save();

    res.status(200).send('POST request received by the server.');
  } catch (error) {
    console.error('Error while saving data:', error);
    res.status(500).send('Error while saving data.');
  }
};

export const handleSaturationSensor = async (req: Request, res: Response) => {
  try {
    const dataBloodSaturation = req.body;
    console.log('Received Saturation data:', dataBloodSaturation);

    const BloodSaturationEntry = new BloodSaturationModel({
      value: dataBloodSaturation.saturation,
    });

    await BloodSaturationEntry.save();

    res.status(200).send('POST request received by the server.');
  } catch (error) {
    console.error('Error while saving data:', error);
    res.status(500).send('Error while saving data.');
  }
};
