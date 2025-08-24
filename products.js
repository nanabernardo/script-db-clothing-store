import express from "express";
import db from "./db.js";

const router = express.Router();

//adicionar produto
router.post("/add", async (req, res) => {
  const { name: productName, quantity } = req.body;

  if (!productName || !quantity) {
    return res
      .status(400)
      .json({ error: "Nome e quantidade são obrigatórios" });
  }

  try {
    await db.run("INSERT INTO products (name, quantity) VALUES (?, ?)", [
      productName,
      quantity,
    ]);
    res.json({ message: "Produto cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar produto" });
  }
});

//listar produtos
router.get("/", async (req, res) => {
  try {
    const products = await db.all("SELECT * FROM products");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
});

export default router;
