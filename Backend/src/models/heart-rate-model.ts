import mongoose from 'mongoose';

const HearthRateSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'MAX30102_HearthRate Sensor' },
	fullDate: {
		type: String,
		default: () => new Date().toISOString().split('T')[0] + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
	},
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().getHours() + ':' + new Date().getMinutes() },
	value: Number,
})

const HearthRateModel = mongoose.model('HearthRate', HearthRateSchema, 'HearthRate');

export default HearthRateModel;