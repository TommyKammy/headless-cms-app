const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ContentRepository {
  async create(data) {
    return await prisma.content.create({
      data: {
        contentModelId: data.contentModelId,
        data: JSON.stringify(data.data)
      },
      include: {
        contentModel: {
          include: {
            fields: true
          }
        }
      }
    });
  }

  async findAll(contentModelId) {
    const contents = await prisma.content.findMany({
      where: contentModelId ? { contentModelId } : {},
      include: {
        contentModel: {
          include: {
            fields: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return contents.map(content => ({
      ...content,
      data: JSON.parse(content.data)
    }));
  }

  async findById(id) {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        contentModel: {
          include: {
            fields: true
          }
        }
      }
    });

    if (content) {
      return {
        ...content,
        data: JSON.parse(content.data)
      };
    }

    return null;
  }

  async findByModelAndId(contentModelId, id) {
    const content = await prisma.content.findFirst({
      where: { 
        id,
        contentModelId 
      },
      include: {
        contentModel: {
          include: {
            fields: true
          }
        }
      }
    });

    if (content) {
      return {
        ...content,
        data: JSON.parse(content.data)
      };
    }

    return null;
  }

  async update(id, data) {
    const updateData = {};
    
    if (data.data) {
      updateData.data = JSON.stringify(data.data);
    }
    
    if (data.contentModelId) {
      updateData.contentModelId = data.contentModelId;
    }

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        contentModel: {
          include: {
            fields: true
          }
        }
      }
    });

    return {
      ...content,
      data: JSON.parse(content.data)
    };
  }

  async delete(id) {
    return await prisma.content.delete({
      where: { id }
    });
  }
}

module.exports = new ContentRepository();
