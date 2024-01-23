import mongoose from 'mongoose';

const BloodSaturationSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'MAX30102_saturation Sensor' },
	fullDate: {
		type: String,
		default: () => new Date().toISOString().split('T')[0] + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
	},
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().getHours() + ':' + new Date().getMinutes() },
	value: Number,
})

const BloodSaturationModel = mongoose.model('BloodSaturation', BloodSaturationSchema, 'BloodSaturation');

export default BloodSaturationModel;
