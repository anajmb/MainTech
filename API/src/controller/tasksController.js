const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tasksController = {
    create: async (req, res) => {
        try {
            const { title, inspectorId, machineId } = req.body;

            if (!title || !inspectorId) {
                return res.status(400).json({
                    msg: "Title and inspectorId are required"
                });
            }

            const task = await prisma.tasks.create({
                data: { title, inspectorId, machineId: machineId || null }
            });

            return res.status(201).json({
                msg: "Task created successfully",
                id: task.id
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
            const tasks = await prisma.tasks.findMany({
                include: {
                    inspector: true,
                    machine: true
                }
            });

            return res.status(200).json(tasks);
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

            const task = await prisma.tasks.findUnique({
                where: { id: parseInt(id) },
                include: {
                    inspector: true,
                    machine: true
                }
            })

            return res.status(200).json(task);
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
            const { title, inspectorId, machineId } = req.body;

            if (!title || !inspectorId) {
                return res.status(400).json({
                    msg: "Title and inspectorId are required"
                });
            }

            const set = await prisma.tasks.update({
                where: { id: Number(id) },
                data: { title, inspectorId, machineId: machineId || null }
            });

            return res.status(200).json({
                msg: "Task updated successfully",
                set: set.id
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
            const {id} = req.params;

            await prisma.tasks.delete({
                where: {id: Number(id)}
            });

            return res.status(200).json({
                msg: "Task deleted successfully"
            });
        } catch (error) {

            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }
}

exports.tasksController = tasksController;