const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ContentModelRepository {
  async create(data) {
    return await prisma.contentModel.create({
      data: {
        name: data.name,
        apiId: data.apiId,
        description: data.description,
        fields: {
          create: data.fields || []
        }
      },
      include: {
        fields: true
      }
    });
  }

  async findAll() {
    return await prisma.contentModel.findMany({
      include: {
        fields: true,
        _count: {
          select: { contents: true }
        }
      }
    });
  }

  async findById(id) {
    return await prisma.contentModel.findUnique({
      where: { id },
      include: {
        fields: true
      }
    });
  }

  async findByApiId(apiId) {
    return await prisma.contentModel.findUnique({
      where: { apiId },
      include: {
        fields: true
      }
    });
  }

  async update(id, data) {
    const { fields, ...modelData } = data;
    
    if (fields) {
      await prisma.field.deleteMany({
        where: { contentModelId: id }
      });
    }

    return await prisma.contentModel.update({
      where: { id },
      data: {
        ...modelData,
        fields: fields ? { create: fields } : undefined
      },
      include: {
        fields: true
      }
    });
  }

  async delete(id) {
    return await prisma.contentModel.delete({
      where: { id }
    });
  }
}

module.exports = new ContentModelRepository();
