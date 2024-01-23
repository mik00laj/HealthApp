import mongoose from 'mongoose';

const BloodPressureSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'Blood Pressure Sensor' },
	fullDate: {
		type: String,
		default: () => new Date().toISOString().split('T')[0] + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
	},
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().getHours() + ':' + new Date().getMinutes() },
	valueSystolic: Number,
	valueDiastolic: Number,
})

const BloodPressureModel = mongoose.model('BloodPressure', BloodPressureSchema, 'BloodPressure');

export default BloodPressureModel;

