const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { createReadStream } = require("fs");
const { parse } = require("csv-parse");

let prisma = new PrismaClient();

async function insertBatch(batch) {
  let retries = 3;
  let inserted = false;
  while (retries > 0 && !inserted) {
    try {
      await prisma.sale.createMany({
        data: batch,
        skipDuplicates: true,
      });
      inserted = true;
    } catch (error) {
      retries--;
      if (retries > 0) {
        console.log(`Connection error, retrying... (${retries} attempts left)`);
        await prisma.$disconnect();
        await new Promise(r => setTimeout(r, 2000));
        prisma = new PrismaClient();
      } else {
        throw error;
      }
    }
  }
}

async function main() {
  const csvFilePath = path.resolve(__dirname, "../../data.csv");
  
  if (!fs.existsSync(csvFilePath)) {
    console.error("File not found:", csvFilePath);
    return;
  }

  console.log("Starting database seeding with streaming...");

  const batchSize = 100;
  let batch = [];
  let recordCount = 0;

  return new Promise((resolve, reject) => {
    const parser = createReadStream(csvFilePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }));

    parser.on("data", async function(record) {
      parser.pause();
      try {
        // Validate and parse date
        const dateStr = record["Date"];
        const parsedDate = new Date(dateStr);
        const isValidDate = !isNaN(parsedDate.getTime()) && dateStr && dateStr.trim() !== "";
        
        const saleRecord = {
          customerId: record["Customer ID"],
          customerName: record["Customer Name"],
          phone: record["Phone Number"],
          gender: record["Gender"],
          age: parseInt(record["Age"], 10),
          region: record["Customer Region"],
          customerType: record["Customer Type"],
          productId: record["Product ID"],
          productName: record["Product Name"],
          brand: record["Brand"],
          category: record["Product Category"],
          tags: record["Tags"] ? record["Tags"].split(",").map(t => t.trim()) : [],
          description: record["Product Description"] || "",
          quantity: parseInt(record["Quantity"], 10),
          pricePerUnit: parseFloat(record["Price per Unit"]),
          discount: parseFloat(record["Discount Percentage"]),
          totalAmount: parseFloat(record["Total Amount"]),
          finalAmount: parseFloat(record["Final Amount"]),
          date: isValidDate ? parsedDate : new Date(),
          paymentMethod: record["Payment Method"],
          orderStatus: record["Order Status"],
          deliveryType: record["Delivery Type"],
          storeId: record["Store ID"],
          storeLocation: record["Store Location"],
          salespersonId: record["Salesperson ID"],
          employeeName: record["Employee Name"]
        };

        batch.push(saleRecord);
        recordCount++;

        if (batch.length >= batchSize) {
          await insertBatch(batch);
          console.log(`Inserted ${recordCount} records...`);
          batch = [];
        }
        
        parser.resume();
      } catch (error) {
        parser.destroy();
        reject(error);
      }
    });

    parser.on("end", async function() {
      // Insert remaining records
      if (batch.length > 0) {
        try {
          await insertBatch(batch);
          console.log(`Inserted final batch. Total records: ${recordCount}`);
        } catch (error) {
          reject(error);
        }
      }
      console.log("Seeding completed successfully.");
      resolve();
    });

    parser.on("error", reject);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
