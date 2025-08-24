import ExcelJS from "exceljs";
import db from "./db.js";

export async function exportToExcel() {
  const products = await db.all("SELECT name, quantity FROM products");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Estoque");

  //cabeçalho
  worksheet.columns = [
    { header: "Produto", key: "name", width: 20 },
    { header: "Quantidade", key: "quantity", width: 15 },
  ];

  //Dados
  products.forEach((p) => worksheet.addRow(p));

  await workbook.xlsx.writeFile("estoque.xlsx");
  console.log("Planilha 'estoque' gerada com sucesso!");
}
