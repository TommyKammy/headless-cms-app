const contentModelRepository = require('../repositories/contentModelRepository');
const contentRepository = require('../repositories/contentRepository');

const publicController = {
  getContents: async (req, res) => {
    try {
      const model = await contentModelRepository.findByApiId(req.params.modelId);
      
      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }

      const contents = await contentRepository.findAll(model.id);
      
      const formattedContents = contents.map(content => ({
        id: content.id,
        ...content.data,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt
      }));

      res.json({
        model: {
          id: model.id,
          name: model.name,
          apiId: model.apiId
        },
        contents: formattedContents
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getContent: async (req, res) => {
    try {
      const model = await contentModelRepository.findByApiId(req.params.modelId);
      
      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }

      const content = await contentRepository.findByModelAndId(model.id, req.params.contentId);
      
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }

      res.json({
        id: content.id,
        ...content.data,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = publicController;
