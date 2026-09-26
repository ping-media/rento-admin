import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (data, fileName) => {
  if (!data || data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Define columns dynamically from data keys
  worksheet.columns = Object.keys(data[0]).map((key) => ({
    header: key,
    key,
    width: 20,
  }));

  // Add rows
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Styling header row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "000000" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Set header row height
  headerRow.height = 30;

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Save as file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
