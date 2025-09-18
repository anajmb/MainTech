const { PrismaClient } = require("@prisma/client");
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
    },
    getAll: async (req, res) => {
        try {
            const subsets = await prisma.subsets.findMany({
                include: { sets: true }
        });

            return res.status(200).json(subsets);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    },
    getUnique: async (req, res) => {
        try {
            const { id } = req.params;

            const subset = await prisma.subsets.findUnique({
                where: { id: parseInt(id) },
                include: { sets: true }
            });

            return res.status(200).json(subset);
        } catch (error) {

            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    msg: "Name is required"
                });
            }

            const subset = await prisma.subsets.update({
                where: { id: Number(id) },
                data: { name }
            });

            return res.status(200).json({
                msg: "Subset updated successfully",
                subset
            });
        } catch (error) {

            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            await prisma.subsets.delete({
                where: { id: Number(id) }
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }

}

module.exports = subSetsController;