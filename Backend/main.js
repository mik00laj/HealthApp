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

const TemperatureSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'DS18B20' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	year: { type: Number, default: () => new Date().getFullYear() },
	month: {
		type: String,
		default: () => new Date().toLocaleDateString('en-US', { month: 'long' }),
	},
	day: {
		type: String,
		default: () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
	},
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	value: Number,
})

const TemperatureModel = mongoose.model('Temperature', TemperatureSchema, 'Temperature')

const HearthRateSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'MAX30102_HearthRate' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	year: { type: Number, default: () => new Date().getFullYear() },
	month: {
		type: String,
		default: () => new Date().toLocaleDateString('en-US', { month: 'long' }),
	},
	day: {
		type: String,
		default: () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
	},
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	value: Number,
})

const HearthRateModel = mongoose.model('HearthRate', HearthRateSchema, 'HearthRate')

const SaturationSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'MAX30102_saturation' },
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	year: { type: Number, default: () => new Date().getFullYear() },
	month: {
		type: String,
		default: () => new Date().toLocaleDateString('en-US', { month: 'long' }),
	},
	day: {
		type: String,
		default: () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
	},
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
	measureId: Number,
	measure: Number,
	value: Number,
})

const SaturationModel = mongoose.model('Saturation', SaturationSchema, 'Saturation')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

app.post('/esp/temperature-sensor', async (req, res) => {
	try {
		const dataTemperature = req.body
		console.log('Received Temperature data:', dataTemperature)

		const temperatureEntry = new TemperatureModel({
			value: dataTemperature.temperature,
			measureId: dataTemperature.measureId,
			measure: dataTemperature.measure,
		})

		temperatureEntry.save()

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

		const pulsEntry = new HearthRateModel({
			value: dataHearthRate.heartbeat,
			measureId: dataHearthRate.measureId,
			measure: dataHearthRate.measure,
		})

		pulsEntry.save()

		res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
	} catch (error) {
		console.error('Błąd podczas zapisywania danych:', error)
		res.status(500).send('Wystąpił błąd podczas zapisywania danych.')
	}
})

app.post('/esp/saturation-sensor', async (req, res) => {
	try {
		const dataSaturation = req.body
		console.log('Received Saturation data:', dataSaturation)

		const saturationEntry = new SaturationModel({
			value: dataSaturation.saturation,
			measureId: dataSaturation.measureId,
			measure: dataSaturation.measure,
		})

		saturationEntry.save()

		res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
	} catch (error) {
		console.error('Błąd podczas zapisywania danych:', error)
		res.status(500).send('Wystąpił błąd podczas zapisywania danych.')
	}
})
app.get('/api/latest-temperature', async (req, res) => {
	try {
		const latestTemperature = await TemperatureModel.findOne().sort({ _id: -1 }).limit(1)

		res.json({
			latestTemperature,
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
app.get('/api/latest-saturation', async (req, res) => {
	try {
		const latestSaturation = await SaturationModel.findOne().sort({ _id: -1 }).limit(1)

		res.json({
			latestSaturation,
		})
	} catch (error) {
		console.error('Błąd podczas pobierania saturacji krwi:', error)
		res.status(500).send('Wystąpił błąd podczas pobierania saturacji krwi.')
	}
})

app.listen(port, () => {
	console.log(`Serwer Express nasłuchuje na porcie ${port}`)
})
