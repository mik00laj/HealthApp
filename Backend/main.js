const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
const port = 4001
const username = 'HealthAppUser'
const password = 'admin'
const clusterName = 'healthappdb'
const databaseName = 'User1'
const connectionStringMongoDB = `mongodb+srv://${username}:${password}@${clusterName}.tir6wnc.mongodb.net/${databaseName}?retryWrites=true&w=majority`

mongoose.connect(connectionStringMongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Błąd połączenia z MongoDB:'))
db.once('open', () => {
	console.log('Połączono z MongoDB Atlas')
})

const temperatureSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'DS18B20' },
	measureId: Number,
	measure: Number,
	value: Number,
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
})

const TemperatureModel = mongoose.model('Temperature', temperatureSchema, 'Temperature')

const bpmSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'MAX30102_bpm' },
	measureId: Number,
	measure: Number,
	value: Number,
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
})

const BPMModel = mongoose.model('Hearthbeat', bpmSchema, 'BPM')

const saturationSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'MAX30102_saturation' },
	measureId: Number,
	measure: Number,
	value: Number,
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().toISOString().split('T')[1].split('.')[0] },
})

const SaturationModel = mongoose.model('Saturation', saturationSchema, 'Saturation')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/esp/temperature-sensor', async (req, res) => {
	try {
		const dataTemperature = req.body
		console.log('Received temperature data:', dataTemperature)

		const temperatureEntry = new TemperatureModel({
			value: dataTemperature.temperature,
			measureId: dataTemperature.measureId,
			measure: dataTemperature.measure,
		})

		temperatureEntry.save();

		res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
	} catch (error) {
		console.error('Błąd podczas zapisywania danych:', error)
		res.status(500).send('Wystąpił błąd podczas zapisywania danych.')
	}
})

app.post('/esp/puls-sensor', async (req, res) => {
	try {
		const dataPuls = req.body
		console.log('Received puls data:', dataPuls)

		const pulsEntry = new BPMModel({
			value: dataPuls.heartbeat,
			measureId: dataPuls.measureId,
			measure: dataPuls.measure,
		})

		pulsEntry.save();

		res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
	} catch (error) {
		console.error('Błąd podczas zapisywania danych:', error)
		res.status(500).send('Wystąpił błąd podczas zapisywania danych.')
	}
})

app.post('/esp/saturation-sensor', async (req, res) => {
	try {
		const dataSaturation = req.body
		console.log('Received saturation data:', dataSaturation)

		const saturationEntry = new SaturationModel({
			value: dataSaturation.saturation,
			measureId: dataSaturation.measureId,
			measure: dataSaturation.measure,
		})

		saturationEntry.save();

		res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
	} catch (error) {
		console.error('Błąd podczas zapisywania danych:', error)
		res.status(500).send('Wystąpił błąd podczas zapisywania danych.')
	}
})

app.listen(port, () => {
	console.log(`Serwer Express nasłuchuje na porcie ${port}`)
})