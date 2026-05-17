import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  duration: { type: String, default: '' },
  highlights: [{ type: String }]
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  techStack: [{ type: String }]
}, { _id: false });

const educationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  year: { type: String, default: '' },
  score: { type: String, default: '' }
}, { _id: false });

const appliedJobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    title: String,
    company: String,
    location: String,
    description: String,
    applyLink: String,
    salary: String,
    employmentType: String,
    status: {
      type: String,
      enum: ['applied', 'interviewing', 'offered', 'rejected'],
      default: 'applied',
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const savedJobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    title: String,
    company: String,
    location: String,
    description: String,
    applyLink: String,
    salary: String,
    employmentType: String,
    matchScore: { type: Number, default: 0 },
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    linkedinUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    resumeText: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    skills: [{ type: String }],
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    certifications: [{ type: String }],
    achievements: [{ type: String }],
    languages_spoken: [{ type: String }],
    atsScore: { type: Number, default: 0 },
    missingSkills: [{ type: String }],
    savedJobs: [savedJobSchema],
    appliedJobs: [appliedJobSchema],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
