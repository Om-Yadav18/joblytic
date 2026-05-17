import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, default: 'Unknown' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    applyLink: { type: String, default: '' },
    salary: { type: String, default: '' },
    employmentType: { type: String, default: '' },
    skills: [{ type: String }],
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
