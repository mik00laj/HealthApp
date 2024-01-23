import mongoose from 'mongoose';

const BodyTemperatureSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'DS18B20 Temperature Sensor' },
	fullDate: {
		type: String,
		default: () => new Date().toISOString().split('T')[0] + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
	},
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().getHours() + ':' + new Date().getMinutes() },
	value: Number,
})

const BodyTemperatureModel = mongoose.model('BodyTemperature', BodyTemperatureSchema, 'BodyTemperature');

export default BodyTemperatureModel;
