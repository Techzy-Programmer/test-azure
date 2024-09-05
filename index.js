import { Hono } from 'hono';
import "dotenv/config";
import { serve } from '@hono/node-server';
import { PrismaClient } from '@prisma/client';

const app = new Hono();
const prisma = new PrismaClient();

app.get('/', (c) => {
  return c.text('Hello, World!');
});

app.post('/posts', async (c) => {
  const { title, content } = await c.req.json();

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
      },
    });
    return c.json(newPost, 201);
  } catch (error) {
    console.log(error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

app.get('/posts', async (c) => {
  try {
    const posts = await prisma.post.findMany();
    return c.json(posts, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error: 'Failed to retrieve posts' }, 500);
  }
});

app.get('/posts/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (post) {
      return c.json(post, 200);
    } else {
      return c.json({ error: 'Post not found' }, 404);
    }
  } catch (error) {
    return c.json({ error: 'Failed to retrieve post' }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: process.env.PORT || 8080
}, () => console.log(`Server running at http://localhost:${process.env.PORT || 8080}`));

console.log("I am new version");
