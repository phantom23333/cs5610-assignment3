import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';

const PORT = parseInt(process.env.PORT) || 8080;

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256',
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

const prisma = new PrismaClient();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/profile/posts', requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;

    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = await prisma.postItem.findMany({
      where: {
        userId: user.id,
      },
    });

    res.json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const { cat } = req.query;

    const filterOptions = cat ? { category: { name: cat } } : {};

    const posts = await prisma.postItem.findMany({
      where: filterOptions,
      include: {
        category: true,
      },
    });

    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/posts', requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;

    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await prisma.postItem.findMany({
      where: {
        userId: user.id,
      },
    });

    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/posts', requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).send('Title and content are required');
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: category.id },
    });

    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const newItem = await prisma.postItem.create({
      data: {
        title,
        content,
        category: { connect: { id: category.id } },
        user: { connect: { id: user.id } },
      },
      include: {
        category: true,
        user: true,
      },
    });

    console.log(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/posts/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedItem = await prisma.postItem.delete({
      where: {
        id,
      },
    });
    res.json(deletedItem);
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const postItem = await prisma.postItem.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        category: true,
      },
    });

    if (!postItem) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(postItem);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/posts/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const updatedItem = await prisma.postItem.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/me', requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;

    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/verify-user', requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
    const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (user) {
      res.json(user);
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          auth0Id,
          name,
        },
      });

      res.json(newUser);
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
