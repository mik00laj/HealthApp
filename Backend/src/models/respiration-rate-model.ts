import mongoose from 'mongoose';

const RespirationRateSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'Respiration Rate Sensor' },
	fullDate: {
		type: String,
		default: () => new Date().toISOString().split('T')[0] + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
	},
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().getHours() + ':' + new Date().getMinutes() },
	value: Number,
})

const RespirationRateModel = mongoose.model('RespirationRate', RespirationRateSchema, 'RespirationRate');

export default RespirationRateModel;