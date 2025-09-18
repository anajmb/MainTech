const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const machinesController = {

    create: async (req, res) => {
        try {
            const { name, description, location, sets, tasks } = req.body;

            if (!name || !description || !location || !sets) {
                return res.status(400).json({
                    msg: "Name, description, location and sets are required"
                });
            }

            const machine = await prisma.machine.create({
                data: {
                    name,
                    description,
                    location,
                    sets: {
                        connect: sets?.map(id => ({ id })) || []
                    },
                    tasks: {
                        connect: tasks?.map(id => ({ id })) || []
                    }
                }
            });

            return res.status(201).json({
                msg: "Machine created successfully",
                id: machine.id
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
            const machines = await prisma.machine.findMany({
                include: {
                    sets: true,
                    tasks: true
                }
            });
            return res.status(200).json(machines);

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
            const machine = await prisma.machine.findUnique({
                where: { id: Number(id) },
                include: {
                    sets: true,
                    tasks: true
                }
            });

            if (!machine) {
                return res.status(404).json({
                    msg: "Machine not found"
                });
            }

            return res.status(200).json(machine);

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
            const { name, description, location, sets, tasks } = req.body;

            if (!name || !description || !location || !sets) {
                return res.status(400).json({
                    msg: "Name, description, location and sets are required"
                });
            }

            const machine = await prisma.machine.update({
                where: { id: Number(id) },
                data: {
                    name, description, location,
                    sets: {
                        set: sets?.map(id => ({ id })) || []
                    },
                    tasks: {
                        set: tasks?.map(id => ({ id })) || []
                    }
                }
            });

            return res.status(200).json({
                msg: "Machine updated successfully"
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

            await prisma.machine.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({
                msg: "Machine deleted successfully"
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }
}

module.exports = machinesController;