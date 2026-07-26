import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { isStaff } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { sort_order: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
  }
});

// GET category by ID or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const id = parseInt(idOrSlug);
    const category = isNaN(id)
      ? await prisma.categories.findUnique({ where: { slug: idOrSlug } })
      : await prisma.categories.findUnique({ where: { id } });
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    res.json(category);
  } catch (error) {
    console.error('Get category detail error:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết danh mục' });
  }
});

// Admin/Staff routes
router.use(isStaff);

// POST create category
router.post('/', async (req, res) => {
  try {
    const { name, slug, icon, parent_id, sort_order } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: 'Tên và slug không được để trống' });
    }

    const category = await prisma.categories.create({
      data: {
        name,
        slug,
        icon: icon || null,
        parent_id: parent_id ? parseInt(parent_id) : null,
        sort_order: sort_order ? parseInt(sort_order) : 0,
      }
    });

    res.status(201).json(category);
  } catch (error: any) {
    console.error('Create category error:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi tạo danh mục' });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, slug, icon, parent_id, sort_order, is_active } = req.body;

    const category = await prisma.categories.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(icon !== undefined && { icon }),
        ...(parent_id !== undefined && { parent_id: parent_id ? parseInt(parent_id) : null }),
        ...(sort_order !== undefined && { sort_order: parseInt(sort_order) }),
        ...(is_active !== undefined && { is_active: Boolean(is_active) }),
      }
    });

    res.json(category);
  } catch (error: any) {
    console.error('Update category error:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật danh mục' });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.categories.delete({ where: { id } });
    res.json({ message: 'Đã xóa danh mục' });
  } catch (error: any) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa danh mục' });
  }
});

export default router;
