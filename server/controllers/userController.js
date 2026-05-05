const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'recipefinder_users' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readableStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    readableStream.pipe(uploadStream);
  });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('followers following savedRecipes');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.specialization = req.body.specialization !== undefined ? req.body.specialization : user.specialization;
      
      if (req.file) {
        if (user.profileImage && user.profileImage.publicId) {
          try {
            await cloudinary.uploader.destroy(user.profileImage.publicId);
          } catch(err) { console.error('Cloudinary destroy error', err); }
        }
        const result = await uploadToCloudinary(req.file.buffer);
        user.profileImage = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } else if (req.body.profileImage) {
        user.profileImage = req.body.profileImage;
      }
      
      if (req.body.socialLinks) {
         user.socialLinks = { ...user.socialLinks, ...req.body.socialLinks };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chefs
// @route   GET /api/users/chefs
// @access  Public
const getChefs = async (req, res, next) => {
  try {
    const chefs = await User.find({ role: 'chef' }).select('-password');
    res.json(chefs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers following', 'name profileImage role');

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getChefs,
  getUserById,
};
