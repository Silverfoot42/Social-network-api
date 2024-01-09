const { isValidObjectId } = require('mongoose');
const { User, Thought } = require('../models');

module.exports = {
  //retrieves all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //retrieves a specific thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //allows a user to create a thought
  async createThought(req, res) {
    try {
      const { thoughtText, username } = req.body;

      const newThought = await Thought.create({ thoughtText, username });

      const user = await User.findOneAndUpdate(
        { username },
        { $push: { thoughts: newThought._id } },
        { new: true }
      );

      if (!user) {
        await Thought.deleteOne({ _id: newThought._id });
        return res.status(404).json({ message: 'Associated user not found' });
      }

      res.json(newThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //allows a thought to be updated
  async updateThought(req, res) {
    try {
      const { thoughtId } = req.params;
      const { thoughtText } = req.body;

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { thoughtText },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //deletes a thought
  async deleteThought(req, res) {
    try {
      const { thoughtId } = req.params;

      const thoughtToDelete = await Thought.findOne({ _id: thoughtId });

      if (!thoughtToDelete) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      await Thought.deleteOne({ _id: thoughtId });

      const user = await User.findOneAndUpdate(
        { username: thoughtToDelete.username },
        { $pull: { thoughts: thoughtId } },
        { new: true }
      );

      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //creates a reaction to a thought
  async createReaction(req, res) {
    try {
      const { thoughtId } = req.params;
      const { reactionBody, username } = req.body;

      const newReaction = { reactionBody, username };

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $push: { reactions: newReaction } },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //deletes a reaction to a specific thought
  async deleteReaction(req, res) {
    try {
      const { thoughtId, reactionId } = req.params;

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { reactionId } } },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};