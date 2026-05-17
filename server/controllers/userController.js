import User from '../models/User.js';

/**
 * GET /api/user/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/user/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, linkedinUrl, skills, education, experience, phone, location, projects, certifications, achievements, languages_spoken } = req.body;

    if (name) user.name = name;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    }
    if (education !== undefined) {
      user.education = Array.isArray(education) ? education.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0) : [];
    }
    if (experience !== undefined) {
      user.experience = Array.isArray(experience) ? experience.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0) : [];
    }
    if (projects !== undefined) {
      user.projects = Array.isArray(projects) ? projects.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0) : [];
    }
    if (certifications !== undefined) user.certifications = Array.isArray(certifications) ? certifications : [];
    if (achievements !== undefined) user.achievements = Array.isArray(achievements) ? achievements : [];
    if (languages_spoken !== undefined) user.languages_spoken = Array.isArray(languages_spoken) ? languages_spoken : [];

    // Defensive check to clean legacy strings
    if (!Array.isArray(user.education)) user.education = [];
    if (!Array.isArray(user.experience)) user.experience = [];
    if (!Array.isArray(user.projects)) user.projects = [];

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      linkedinUrl: updated.linkedinUrl,
      resumeUrl: updated.resumeUrl,
      phone: updated.phone,
      location: updated.location,
      skills: updated.skills,
      education: updated.education,
      experience: updated.experience,
      projects: updated.projects,
      certifications: updated.certifications,
      achievements: updated.achievements,
      languages_spoken: updated.languages_spoken,
      atsScore: updated.atsScore,
      missingSkills: updated.missingSkills,
      savedJobs: updated.savedJobs,
      appliedJobs: updated.appliedJobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
