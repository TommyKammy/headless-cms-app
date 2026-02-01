const contentModelRepository = require('../repositories/contentModelRepository');
const contentRepository = require('../repositories/contentRepository');

const adminController = {
  createModel: async (req, res) => {
    try {
      const model = await contentModelRepository.create(req.body);
      res.status(201).json(model);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllModels: async (req, res) => {
    try {
      const models = await contentModelRepository.findAll();
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getModelById: async (req, res) => {
    try {
      const model = await contentModelRepository.findById(req.params.id);
      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateModel: async (req, res) => {
    try {
      const model = await contentModelRepository.update(req.params.id, req.body);
      res.json(model);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteModel: async (req, res) => {
    try {
      await contentModelRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createContent: async (req, res) => {
    try {
      const content = await contentRepository.create(req.body);
      res.status(201).json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllContents: async (req, res) => {
    try {
      const contents = await contentRepository.findAll(req.query.modelId);
      res.json(contents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getContentById: async (req, res) => {
    try {
      const content = await contentRepository.findById(req.params.id);
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateContent: async (req, res) => {
    try {
      const content = await contentRepository.update(req.params.id, req.body);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteContent: async (req, res) => {
    try {
      await contentRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = adminController;
