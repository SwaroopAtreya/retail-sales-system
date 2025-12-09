const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "date",
      sortOrder = "desc",
      region,
      gender,
      category,
      paymentMethod,
      minAge,
      maxAge,
      startDate,
      endDate,
      tags
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (region) where.region = { in: Array.isArray(region) ? region : [region] };
    if (gender) where.gender = { in: Array.isArray(gender) ? gender : [gender] };
    if (category) where.category = { in: Array.isArray(category) ? category : [category] };
    if (paymentMethod) where.paymentMethod = { in: Array.isArray(paymentMethod) ? paymentMethod : [paymentMethod] };

    if (tags) {
      const tagList = Array.isArray(tags) ? tags : [tags];
      where.tags = { hasSome: tagList };
    }

    if (minAge || maxAge) {
      where.age = {};
      if (minAge) where.age.gte = parseInt(minAge);
      if (maxAge) where.age.lte = parseInt(maxAge);
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    let orderBy = {};
    if (sortBy === "date") orderBy = { date: sortOrder };
    else if (sortBy === "quantity") orderBy = { quantity: sortOrder };
    else if (sortBy === "customerName") orderBy = { customerName: sortOrder };

    const [sales, total] = await prisma.$transaction([
      prisma.sale.findMany({ where, take, skip, orderBy }),
      prisma.sale.count({ where }),
    ]);

    res.json({
      data: sales,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
