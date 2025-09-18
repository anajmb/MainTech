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
    }
}

exports.tasksController = tasksController;