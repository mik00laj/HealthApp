const express = require('express')
const app = express()
const port = 4001
const bodyParser = require('body-parser')



app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.post('/ESP/PULS-SENSOR', (req, res) => {
	// Obsługa zapytania POST na "/ESP/PULS-SENSOR"
	console.log('Otrzymano zapytanie POST na /ESP/PULS-SENSOR')

	const data = req.body

	console.log('Received data:', data)

	// Odpowiedź serwera
	res.status(200).send('Zapytanie POST zostało odebrane przez serwer.')
})

app.listen(port, () => {
	console.log(`Serwer Express nasłuchuje na porcie ${port}`)
})
