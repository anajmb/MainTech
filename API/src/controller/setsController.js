const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const stesController = {

    create: async (req, res) => {
        try {

            const { name, machineId, subsets } = req.body;

            if (!name || !machineId) {
                return res.status(400).json({
                    msg: "Name and machineId are required"
                });
            }

            const set = await prisma.sets.create({
                data: {
                    name,
                    machineId,
                    subsets: {
                        connect: subsets?.map(id => ({ id })) || []
                    }
                }
            });

            return res.status(201).json({
                msg: "Set created successfully",
                id: set.id
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
            const sets = await prisma.sets.findMany({
                include: {
                    machine: true,
                    subsets: true
                }
            });
            return res.status(200).json(sets);
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

            const set = await prisma.sets.findUnique({
                where: { id: parseInt(id) },
                include: {
                    machine: true,
                    subsets: true
                }
            });

            return res.status(200).json(set);
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
            const { name, machineId, subsets } = req.body;

            if (!name || !machineId || !subsets) {
                return res.status(400).json({
                    msg: "Name and machineId are required"
                });
            }

            const set = await prisma.sets.update({
                where: { id: parseInt(id) },
                data: { name, machineId, subsets: { set: subsets?.map(id => ({ id })) || [] } }
            });

            return res.status(200).json({
                msg: "Set updated successfully",
                id: set.id
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

            await prisma.sets.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({
                msg: "Set deleted successfully"
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }
};

module.exports = stesController;
