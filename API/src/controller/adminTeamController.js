const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const adminTeamController = {
    // Create a new AdminTeam
    create: async (req, res) => {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({
                    msg: "Name and description are required"
                });
            }

            const team = await prisma.adiminTeam.create({
                data: { name, description }
            });

            return res.status(201).json({
                msg: "AdminTeam created successfully",
                id: team.id
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    },

    // Get all AdminTeams
    getAll: async (req, res) => {
        try {
            const teams = await prisma.adiminTeam.findMany();
            return res.status(200).json(teams);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    },

    // Get one AdminTeam by id
    getUnique: async (req, res) => {
        try {
            const { id } = req.params;
            const team = await prisma.adiminTeam.findUnique({
                where: { id: Number(id) }
            });

            if (!team) {
                return res.status(404).json({
                    msg: "AdminTeam not found"
                });
            }

            return res.status(200).json(team);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    },

    // Update AdminTeam
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({
                    msg: "Name and description are required"
                });
            }

            const team = await prisma.adiminTeam.update({
                where: { id: Number(id) },
                data: { name, description }
            });

            return res.status(200).json({
                msg: "AdminTeam updated successfully",
                team
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    },

    // Delete AdminTeam
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.adiminTeam.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({
                msg: "AdminTeam deleted successfully"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }
};

module.exports = adminTeamController;