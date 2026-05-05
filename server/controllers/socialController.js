const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Follow = require('../models/Follow');
const Bookmark = require('../models/Bookmark');
const Notification = require('../models/Notification');

const createNotification = async (req, recipientId, type, message, link) => {
  if (req.user && req.user._id.toString() !== recipientId.toString()) {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type,
      message,
      link,
    });
    // Emit real-time event
    if (req.io) {
      req.io.to(recipientId.toString()).emit('new_notification', notification);
    }
  }
};

// @desc    Like or Unlike a recipe
// @route   POST /api/social/recipes/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    const existingLike = await Like.findOne({ user: req.user._id, recipe: recipeId });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      recipe.likesCount = Math.max(0, recipe.likesCount - 1);
      await recipe.save();
      res.json({ message: 'Recipe unliked', likesCount: recipe.likesCount });
    } else {
      // Like
      await Like.create({ user: req.user._id, recipe: recipeId });
      recipe.likesCount += 1;
      await recipe.save();

      // Notify owner
      await createNotification(
        req,
        recipe.chef,
        'like',
        `${req.user.name} liked your recipe ${recipe.title}`,
        `/recipes/${recipe._id}`
      );

      res.json({ message: 'Recipe liked', likesCount: recipe.likesCount });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment
// @route   POST /api/social/recipes/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    const comment = await Comment.create({
      user: req.user._id,
      recipe: recipeId,
      text,
    });

    recipe.commentsCount += 1;
    await recipe.save();

    await createNotification(
      req,
      recipe.chef,
      'comment',
      `${req.user.name} commented on your recipe ${recipe.title}`,
      `/recipes/${recipe._id}`
    );

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name profileImage');
    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a recipe
// @route   GET /api/social/recipes/:id/comments
// @access  Public
const getRecipeComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ recipe: req.params.id })
      .populate('user', 'name profileImage')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/social/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this comment');
    }

    const recipe = await Recipe.findById(comment.recipe);
    if (recipe) {
      recipe.commentsCount = Math.max(0, recipe.commentsCount - 1);
      await recipe.save();
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow or Unfollow a user
// @route   POST /api/social/users/:id/follow
// @access  Private
const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot follow yourself');
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      res.status(404);
      throw new Error('User not found');
    }

    const existingFollow = await Follow.findOne({ follower: req.user._id, following: targetUserId });

    if (existingFollow) {
      // Unfollow
      await existingFollow.deleteOne();
      
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUser._id);
      
      await currentUser.save();
      await targetUser.save();

      res.json({ message: 'Unfollowed user' });
    } else {
      // Follow
      await Follow.create({ follower: req.user._id, following: targetUserId });

      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUser._id);
      
      await currentUser.save();
      await targetUser.save();

      await createNotification(
        req,
        targetUserId,
        'follow',
        `${req.user.name} started following you`,
        `/users/${req.user._id}`
      );

      res.json({ message: 'Followed user' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark or Unbookmark a recipe
// @route   POST /api/social/recipes/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      res.status(404);
      throw new Error('Recipe not found');
    }

    const user = await User.findById(req.user._id);
    const existingBookmark = await Bookmark.findOne({ user: req.user._id, recipe: recipeId });

    if (existingBookmark) {
      // Remove bookmark
      await existingBookmark.deleteOne();
      user.savedRecipes.pull(recipeId);
      await user.save();
      res.json({ message: 'Recipe removed from bookmarks' });
    } else {
      // Add bookmark
      await Bookmark.create({ user: req.user._id, recipe: recipeId });
      user.savedRecipes.push(recipeId);
      await user.save();
      res.json({ message: 'Recipe bookmarked' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleLike,
  addComment,
  getRecipeComments,
  deleteComment,
  toggleFollow,
  toggleBookmark,
};
