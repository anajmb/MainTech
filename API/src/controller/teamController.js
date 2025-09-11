const { PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

const teamController = {

    create: async (req, res) => {
        try {
            const { name, description} = req.body;

        if (!name || !description) {
            return res.status(400).json({
                msg: "Name and description are required"
            });
        }
        
        const team = await prisma.team.create({
            data: {name, description}
        });

        return res.status(201).json({
            msg: "Team created succesfully",
            id: team.id
        });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            })
        }
    },

    getAll: async (req, res) => {
        try {
            const teams = await prisma.team.findMany();
            return res.status(200).json(teams);
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
            const team = await prisma.team.findUnique({
                where: { id: Number(id) }
            });

            if (!team) {
                return res.status(404).json({
                    msg: "Team not found"
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

      update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({
                    msg: "Name and description are required"
                });
            }

            const team = await prisma.team.update({
                where: { id: Number(id) },
                data: { name, description }
            });

            return res.status(200).json({
                msg: "Team updated successfully",
                team
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
            await prisma.team.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({
                msg: "Team deleted successfully"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }
};

module.exports = teamController;