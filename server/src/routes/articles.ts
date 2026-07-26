import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all articles
router.get('/', async (req, res) => {
  try {
    const limitParam = req.query.limit;
    const limit = limitParam ? parseInt(String(limitParam), 10) : undefined;

    const articles = await prisma.articles.findMany({
      where: { is_published: true },
      orderBy: { created_at: 'desc' },
      ...(limit && !isNaN(limit) ? { take: limit } : {}),
    });
    
    // Map to frontend interface — return plain array (frontend expects Array.isArray check)
    const mapped = articles.map(a => ({
      id: a.slug,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || "",
      content: a.content || "",
      image: a.image || "",
      date: a.date,
      month: "",
      views: a.views || 0,
      comments: 0,
      category: a.category || "Tin Tức",
      author: a.author || "Admin",
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Fetch articles error:', error);
    // Gracefully return empty if table doesn't exist
    res.json([]);
  }
});

// Get article by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await prisma.articles.findUnique({
      where: { slug }
    });
    
    if (!article) return res.status(404).json({ message: 'Not found' });
    
    res.json({
      id: article.slug,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content || "",
      image: article.image || "",
      date: article.date,
      month: "",
      fullDate: article.date,
      category: article.category || "Tin Tức",
      author: article.author || "Admin",
      views: 0,
      comments: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// Get related articles
router.get('/:slug/related', async (req, res) => {
  try {
    const { slug } = req.params;
    const articles = await prisma.articles.findMany({
      where: { NOT: { slug } },
      take: 3,
      orderBy: { created_at: 'desc' }
    });
    
    const mapped = articles.map(a => ({
      id: a.slug,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || "",
      image: a.image || "",
      fullDate: a.date,
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json([]);
  }
});

// Seed Endpoint for initial demo setup
router.post('/seed', async (req, res) => {
  try {
    const { items } = req.body;
    if (items && items.length > 0) {
      await prisma.articles.createMany({
        data: items.map((i: any) => ({
          slug: i.id || `bai-viet-${Date.now()}`,
          title: i.title,
          excerpt: i.excerpt,
          content: i.content,
          image: i.image,
          date: i.date || new Date().toISOString(),
          category: i.category,
          author: i.author
        }))
      });
      res.json({ success: true, count: items.length });
    } else {
      res.json({ success: false, message: 'No items' });
    }
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

export default router;
