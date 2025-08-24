import express from "express";
import productRoutes from "./products.js";
import readline from "readline";
import { exportToExcel } from "./export.js";

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

(async () => {
  let continuar = true;
  const fetch = (await import("node-fetch")).default;

  while (continuar) {
    const name = await question("Digite o nome do produto: ");
    const quantity = await question("Digite a quantidade em estoque: ");

    const response = await fetch(`http://localhost:${PORT}/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity: parseInt(quantity) }),
    });

    const data = await response.json();
    console.log(data);

    const again = await question("Deseja cadastrar outro produto? (s/n): ");
    continuar = again.toLowerCase().startsWith("s");
  }

  //Exporta para Excel
  await exportToExcel();

  rl.close();
  process.exit();
})();
