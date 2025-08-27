import express from "express";
import productRoutes from "./products.js";
import readline from "readline";
import { exportToExcel } from "./export.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { access } from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const app = express();
app.use(express.json());
app.use("/products", productRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

//abre conexão com o banco SQLite
const db = await open({
  filename: "./store.db",
  driver: sqlite3.Database,
});

(async () => {
  let continuar = true;
  const fetch = (await import("node-fetch")).default;

  while (continuar) {
    const action = await question(
      "\nDigite [1] para adicionar, [2] para excluir, [3] para listar produtos ou [0] para sair: "
    );

    if (action === "1") {
      const name = await question("Digite o nome do produto: ");
      const quantity = await question("Digite a quantidade em estoque: ");

      const response = await fetch(`http://localhost:${PORT}/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity: parseInt(quantity) }),
      });
      const data = await response.json();
      console.log(data);
    } else if (action === "2") {
      //excluir produtos
      const id = await question("Digite o ID do produto a ser excluído: ");

      const response = await fetch(`http://localhost:${PORT}/products/${id}`, {
        method: "DELETE",
      });
      console.log(`Produto com ID ${id} excluído.`);
    } else if (action === "3") {
      //Listar produtos

      const products = await db.all("SELECT * FROM products");

      console.log("\n--- Produtos em estoque ---");
      products.forEach((p) => {
        console.log(
          `ID: ${p.id} | Nome: ${p.name} | Quantidade: ${p.quantity}`
        );
      });
    } else if (action === "0") {
      continuar = false; //encerra o loop
    } else {
      console.log("Opção inválida");
    }
  }

  //Exporta para Excel
  await exportToExcel();

  rl.close();
  process.exit();
})();
