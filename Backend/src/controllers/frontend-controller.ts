import { Request, Response } from 'express';
import BodyTemperatureModel from '../models/body-temperature-model';
import HearthRateModel from '../models/heart-rate-model';
import BloodSaturationModel from '../models/blood-saturation-model';
import BodyWeightModel from '../models/body-weight-model';
import RespirationRateModel from '../models/respiration-rate-model';
import BloodPressureModel from '../models/blood-pressure-model';


export const getLatestBodyTemperature = async (req: Request, res: Response) => {
  try {
    const latestBodyTemperature = await BodyTemperatureModel.findOne().sort({ _id: -1 }).limit(1);

    res.json({
      latestBodyTemperature,
    });
  } catch (error) {
    console.error('Error while fetching body temperature:', error);
    res.status(500).send('Error while fetching body temperature.');
  }
};

export const getLatestHearthRate = async (req: Request, res: Response) => {
  try {
    const latestHearthRate = await HearthRateModel.findOne().sort({ _id: -1 }).limit(1);

    res.json({
      latestHearthRate,
    });
  } catch (error) {
    console.error('Error while fetching heart rate:', error);
    res.status(500).send('Error while fetching heart rate.');
  }
};

export const getLatestBloodSaturation = async (req: Request, res: Response) => {
  try {
    const latestBloodSaturation = await BloodSaturationModel.findOne().sort({ _id: -1 }).limit(1);

    res.json({
      latestBloodSaturation,
    });
  } catch (error) {
    console.error('Error while fetching blood saturation:', error);
    res.status(500).send('Error while fetching blood saturation.');
  }
};

export const getLatestBodyWeight = async (req: Request, res: Response) => {
    try {
      const latestBodyWeight = await BodyWeightModel.findOne().sort({ _id: -1 }).limit(1);
      res.json({ latestBodyWeight });
    } catch (error) {
      console.error('Error while fetching latest body weight:', error);
      res.status(500).send('Error while fetching latest body weight.');
    }
  };

  export const getLatestRespirationRate = async (req: Request, res: Response) => {
    try {
      const latestRespirationRate = await RespirationRateModel.findOne().sort({ _id: -1 }).limit(1);
      res.json({ latestRespirationRate });
    } catch (error) {
      console.error('Error while fetching latest respiration rate:', error);
      res.status(500).send('Error while fetching latest respiration rate.');
    }
  };

  export const getLatestBloodPressure = async (req: Request, res: Response) => {
    try {
      const latestBloodPressure = await BloodPressureModel.findOne().sort({ _id: -1 }).limit(1);
      res.json({ latestBloodPressure });
    } catch (error) {
      console.error('Error while fetching latest blood pressure:', error);
      res.status(500).send('Error while fetching latest blood pressure.');
    }
  };

  export const getAllBodyTemperatureData = async (req: Request, res: Response) => {
    try {
      const allBodyTemperature = {
        bodyTemperature: await BodyTemperatureModel.find(),
      };
      res.json(allBodyTemperature);
    } catch (error) {
      console.error('Error while fetching all body temperature data:', error);
      res.status(500).send('Error while fetching all body temperature data.');
    }
  };
  
  export const getAllBloodSaturationData = async (req: Request, res: Response) => {
    try {
      const allBloodSaturation = {
        bloodSaturation: await BloodSaturationModel.find(),
      };
      res.json(allBloodSaturation);
    } catch (error) {
      console.error('Error while fetching all blood saturation data:', error);
      res.status(500).send('Error while fetching all blood saturation data.');
    }
  };

  export const getAllHearthRateData = async (req: Request, res: Response) => {
    try {
      const allHearthRate = {
        hearthRate: await HearthRateModel.find(),
      };
      res.json(allHearthRate);
    } catch (error) {
      console.error('Error while fetching all hearth rate data:', error);
      res.status(500).send('Error while fetching all hearth rate data.');
    }
  };
  
  export const getAllBodyWeightData = async (req: Request, res: Response) => {
    try {
      const allBodyWeight = {
        bodyWeight: await BodyWeightModel.find(),
      };
      res.json(allBodyWeight);
    } catch (error) {
      console.error('Error while fetching all body weight data:', error);
      res.status(500).send('Error while fetching all body weight data.');
    }
  };
  
  export const getAllRespirationRateData = async (req: Request, res: Response) => {
    try {
      const allRespirationRate = {
        respirationRate: await RespirationRateModel.find(),
      };
      res.json(allRespirationRate);
    } catch (error) {
      console.error('Error while fetching all respiration rate data:', error);
      res.status(500).send('Error while fetching all respiration rate data.');
    }
  };

  export const getAllBloodPressureData = async (req: Request, res: Response) => {
    try {
      const allBloodPressure = {
        bloodPressure: await BloodPressureModel.find(),
      };
      res.json(allBloodPressure);
    } catch (error) {
      console.error('Error while fetching all blood pressure data:', error);
      res.status(500).send('Error while fetching all blood pressure data.');
    }
  };