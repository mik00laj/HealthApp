const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()
const port = 4001
const username = 'HealthAppUser'
const password = 'admin'
const clusterName = 'healthappdb'
const databaseName = 'User1'
const connectionStringMongoDB = `mongodb+srv://${username}:${password}@${clusterName}.tir6wnc.mongodb.net/${databaseName}?retryWrites=true&w=majority`

mongoose.connect(connectionStringMongoDB, { useNewUrlParser: true, useUnifiedTopology: true });


const dataBaseStatus = mongoose.connection
dataBaseStatus.on('error', console.error.bind(console, 'Błąd połączenia z MongoDB:'))
dataBaseStatus.once('open', () => {
	console.log('Połączono z MongoDB Atlas')
})

const BodyTemperatureSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'DS18B20 Temperature Sensor' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	value: Number,
})

const BodyTemperatureModel = mongoose.model('BodyTemperature', BodyTemperatureSchema, 'BodyTemperature')


const BloodSaturationSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'MAX30102_saturation Sensor' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	value: Number,
})

const BloodSaturationModel = mongoose.model('BloodSaturation', BloodSaturationSchema, 'BloodSaturation')

const HearthRateSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'MAX30102_HearthRate Sensor' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	value: Number,
})

const HearthRateModel = mongoose.model('HearthRate', HearthRateSchema, 'HearthRate')

const BodyWeightSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'Body Weight Sensor' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	value: Number,
})

const BodyWeightModel = mongoose.model('BodyWeight', BodyWeightSchema, 'BodyWeight')

const RespirationRateSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'Respiration Rate Sensor' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	value: Number,
})

const RespirationRateModel = mongoose.model('RespirationRate', RespirationRateSchema, 'RespirationRate')

const BloodPressureSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'Blood Pressure Sensor' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	valueSystolic: Number,
	valueDiastolic: Number,
})

const BloodPressureModel = mongoose.model('BloodPressure', BloodPressureSchema, 'BloodPressure')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

app.post('/esp/temperature-sensor', async (req, res) => {
	try {
		const dataBodyTemperature = req.body
		console.log('Received Temperature data:', dataBodyTemperature)

		const BodyTemperatureEntry = new BodyTemperatureModel({
			value: dataBodyTemperature.temperature,
			measureId: dataBodyTemperature.measureId,
			measure: dataBodyTemperature.measure,
		})

		BodyTemperatureEntry.save()

		res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
	} catch (error) {
		console.error('Błąd podczas zapisywania danych:', error)
		res.status(500).send('Wystąpił błąd podczas zapisywania danych.')
	}
})

app.post('/esp/puls-sensor', async (req, res) => {
	try {
		const dataHearthRate = req.body
		console.log('Received HearthRate data:', dataHearthRate)

		const HearthRateEntry = new HearthRateModel({
			value: dataHearthRate.heartbeat,
			measureId: dataHearthRate.measureId,
			measure: dataHearthRate.measure,
		})

		HearthRateEntry.save()

		res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
	} catch (error) {
		console.error('Błąd podczas zapisywania danych:', error)
		res.status(500).send('Wystąpił błąd podczas zapisywania danych.')
	}
})

app.post('/esp/saturation-sensor', async (req, res) => {
	try {
		const dataBloodSaturation = req.body
		console.log('Received Saturation data:', dataBloodSaturation)

		const BloodSaturationEntry = new BloodSaturationModel({
			value: dataBloodSaturation.saturation,
			measureId: dataBloodSaturation.measureId,
			measure: dataBloodSaturation.measure,
		})

		BloodSaturationEntry.save()

		res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
	} catch (error) {
		console.error('Błąd podczas zapisywania danych:', error)
		res.status(500).send('Wystąpił błąd podczas zapisywania danych.')
	}
})
app.get('/api/latest-body-temperature', async (req, res) => {
	try {
		const latestBodyTemperature = await BodyTemperatureModel.findOne().sort({ _id: -1 }).limit(1)

		res.json({
			latestBodyTemperature,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania temperatury:', error)
		res.status(500).send('Wystąpił błąd podczas pobierania temperatury.')
	}
})
app.get('/api/latest-hearth-rate', async (req, res) => {
	try {
		const latestHearthRate = await HearthRateModel.findOne().sort({ _id: -1 }).limit(1)

		res.json({
			latestHearthRate,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania tętna:', error)
		res.status(500).send('Wystąpił błąd podczas pobierania tętna.')
	}
})
app.get('/api/latest-blood-saturation', async (req, res) => {
	try {
		const latestBloodSaturation = await BloodSaturationModel.findOne().sort({ _id: -1 }).limit(1)

		res.json({
			latestBloodSaturation,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania saturacji krwi:', error)
		res.status(500).send('Wystąpił błąd podczas pobierania saturacji krwi.')
	}
})
app.get('/api/latest-body-weight', async (req, res) => {
	try {
		const latestBodyWeight = await BodyWeightModel.findOne().sort({ _id: -1 }).limit(1)

		res.json({
			latestBodyWeight,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania saturacji krwi:', error)
		res.status(500).send('Wystąpił błąd podczas pobierania saturacji krwi.')
	}
})

app.get('/api/latest-respiration-rate', async (req, res) => {
	try {
		const latestRespirationRate = await RespirationRateModel.findOne().sort({ _id: -1 }).limit(1)

		res.json({
			latestRespirationRate,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania saturacji krwi:', error)
		res.status(500).send('Wystąpił błąd podczas pobierania saturacji krwi.')
	}
})

app.get('/api/latest-blood-pressure', async (req, res) => {
	try {
		const latestBloodPressure = await BloodPressureModel.findOne().sort({ _id: -1 }).limit(1)

		res.json({
			latestBloodPressure,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania saturacji krwi:', error)
		res.status(500).send('Wystąpił błąd podczas pobierania saturacji krwi.')
	}
})


app.get('/api/all-data-body-temperature', async (req, res) => {
    try {
        const allBodyTemperature = {
            bodyTemperature: await BodyTemperatureModel.find(),

        };

        res.json(allBodyTemperature);
    } catch (error) {
        console.error('Błąd podczas pobierania wszystkich danych:', error);
        res.status(500).send('Wystąpił błąd podczas pobierania wszystkich danych.');
    }
});


app.get('/api/all-data-blood-saturation', async (req, res) => {
    try {
        const allBloodSaturation = {

            bloodSaturation: await BloodSaturationModel.find(),

        };

        res.json(allBloodSaturation);
    } catch (error) {
        console.error('Błąd podczas pobierania wszystkich danych:', error);
        res.status(500).send('Wystąpił błąd podczas pobierania wszystkich danych.');
    }
});


app.get('/api/all-data-hearth-rate', async (req, res) => {
    try {
        const allHearthRate = {

            hearthRate: await HearthRateModel.find(),

        };

        res.json(allHearthRate);
    } catch (error) {
        console.error('Błąd podczas pobierania wszystkich danych:', error);
        res.status(500).send('Wystąpił błąd podczas pobierania wszystkich danych.');
    }
});

app.get('/api/all-data-body-weight', async (req, res) => {
    try {
        const allBodyWeight = {

            bodyWeight: await BodyWeightModel.find(),

        };

        res.json(allBodyWeight);
    } catch (error) {
        console.error('Błąd podczas pobierania wszystkich danych:', error);
        res.status(500).send('Wystąpił błąd podczas pobierania wszystkich danych.');
    }
});

app.get('/api/all-data-respiration-rate', async (req, res) => {
    try {
        const allRespirationRate = {

            respirationRate: await RespirationRateModel.find(),
         
        };

        res.json(allRespirationRate);
    } catch (error) {
        console.error('Błąd podczas pobierania wszystkich danych:', error);
        res.status(500).send('Wystąpił błąd podczas pobierania wszystkich danych.');
    }
});

app.get('/api/all-data-blood-pressure', async (req, res) => {
    try {
        const allBloodPressure = {
            bloodPressure: await BloodPressureModel.find(),
        };

        res.json(allBloodPressure);
    } catch (error) {
        console.error('Błąd podczas pobierania wszystkich danych:', error);
        res.status(500).send('Wystąpił błąd podczas pobierania wszystkich danych.');
    }
});

app.listen(port, () => {
	console.log(`Serwer Express nasłuchuje na porcie ${port}`)
})
