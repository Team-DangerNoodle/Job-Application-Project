const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  createdAt: { type: Date, default: new Date() },
  title: { type: String, required: true },
  url: { type: String, required: true },
  company_name: { type: String },
  company_logo: { type: String },
  coategory: { type: String },
  job_type: { type: String },
  publication_date: { type: String },
  candidate_required_location: { type: String },
  salary: { type: String },
  description: { type: String },
  remotive_id: { type: String, unique: false },
  progress: { type: String, required: true },
  priority: { type: Number, required: true },
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  // },
  userId : {type: String, required: true}
});

module.exports = mongoose.model('Application', applicationSchema);
