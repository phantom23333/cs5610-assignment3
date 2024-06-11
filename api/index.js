import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from  'express-oauth2-jwt-bearer'

const PORT = parseInt(process.env.PORT) || 8080;


// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();


app.get("/ping", (req, res) => {
  res.send("pong");
});


app.get("/profile/posts", requireAuth, async (req, res) => {
  try {
    
    const auth0Id = req.auth.payload.sub;

    
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const userPosts = await prisma.postItem.findMany({
      where: {
        userId: user.id,
      },
    });

    
    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/posts",async (req, res) => {
  try {
    const { cat } = req.query;

    
    if (req.auth) {
      const auth0Id = req.auth.payload.sub;
      const user = await prisma.user.findUnique({
        where: {
          auth0Id,
        },
        include: {
          category: true,
        },
      });

      const posts = await prisma.postItem.findMany({
        where: {
          userId: user.id,
        },
      });
      console.log(posts);
      res.json(posts);
    } else {
      
      const filterOptions = cat ? { category: { name: cat } } : {};

      const posts = await prisma.postItem.findMany({
        where: filterOptions,
        include: {
          category: true,
        },
      });

      console.log(posts);
      res.json(posts);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// requireAuth middleware will validate the access token sent by the client and will return the user information within req.auth
app.get("user/posts", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub

  console.log(req.auth)

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
    include: {
      category: true,
    },
  });

  const posts = await prisma.postItem.findMany({
    where: {
      userId: user.id,
    },
  });
  console.log(posts);
  res.json(posts);
});


// creates a post item
app.post("/posts", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { title,content,category } = req.body;
  console.log(req.body)
  const catId = category.id

  if (!title || !content) {
    res.status(400).send("title is required");
  } else {
    const newItem = await prisma.postItem.create({
      data: {
        title,
        content,
        category:{connect: {id:catId }},
        user: { connect: { auth0Id } },
      },
      include: {
        category: true,
      },
    });
    console.log(newItem);

    res.status(201).json(newItem);
  }
});

// deletes a post item by id
app.delete("/posts/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const deletedItem = await prisma.postItem.delete({
    where: {
      id,
    },
  });
  res.json(deletedItem);
});


// get a post item by id(WHEN UNAUTHORIZED)
app.get("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const postItem = await prisma.postItem.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!postItem) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(postItem);
});



// updates a post item by id
app.put("/posts/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const updatedItem = await prisma.postItem.update({
    where: {
      id,
    },
    data: {
      title, 
      content
    },
  });
  res.json(updatedItem);
});

// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
 })