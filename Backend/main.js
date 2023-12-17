const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express()
const port = 4001
const connectionStringMongoDB = 'mongodb+srv://HealthAppUser:admin@healthappdb.tir6wnc.mongodb.net/?retryWrites=true&w=majority'; 


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/ESP/TEMPERATURE-SENSOR', (req, res) => {
	// Obsługa zapytania POST na "ESP/TEMPERATURE-SENSOR"
	console.log('Otrzymano zapytanie POST na ESP/TEMPERATURE-SENSOR')
	const dataTemperature = req.body
	console.log('Received data:', dataTemperature)
	// Odpowiedź serwera
	res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
})

app.post('/ESP/SATURATION-SENSOR', (req, res) => {
	// Obsługa zapytania POST na "/ESP/SATURATION-SENSOR"
	console.log('Otrzymano zapytanie POST na ESP/SATURATION-SENSOR')
	const dataSaturation = req.body
	console.log('Received data:', dataSaturation)
	// Odpowiedź serwera
	res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
})

app.post('/ESP/PULS-SENSOR', (req, res) => {
	// Obsługa zapytania POST na "/ESP/PULS-SENSOR"
	console.log('Otrzymano zapytanie POST na ESP/PULS-SENSOR')
	const dataPuls = req.body
	console.log('Received data:', dataPuls)
	// Odpowiedź serwera
	res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
})


app.listen(port, () => {
	console.log(`Serwer Express nasłuchuje na porcie ${port}`)
})