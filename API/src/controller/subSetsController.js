const { PrismaClient } = require("@prisma/client");     
const { create } = require("./employeesController");
const prisma = new PrismaClient();

const subSetsController = {

    create: async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    msg: "Name is required"
                });
            }

            const subset = await prisma.subsets.create({
                data: { name }
            });

            return res.status(201).json({
                msg: "Subset created successfully",
                id: subset.id
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }
}

exports.subSetsController = subSetsController;