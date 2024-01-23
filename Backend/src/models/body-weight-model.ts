import mongoose from 'mongoose';

const BodyWeightSchema = new mongoose.Schema({
	sensorId: { type: String, default: 'Body Weight Sensor' },
	fullDate: {
		type: String,
		default: () => new Date().toISOString().split('T')[0] + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
	},
	date: { type: String, default: () => new Date().toISOString().split('T')[0] },
	time: { type: String, default: () => new Date().getHours() + ':' + new Date().getMinutes() },
	value: Number,
})

const BodyWeightModel = mongoose.model('BodyWeight', BodyWeightSchema, 'BodyWeight');

export default BodyWeightModel;


