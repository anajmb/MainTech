const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const teamMemberController = {
    // Adiciona um membro ao time
    create: async (req, res) => {
        try {
            const { teamId, personId } = req.body;

            if (!teamId || !personId) {
                return res.status(400).json({ msg: "teamId e personId são obrigatórios" });
            }

            const member = await prisma.teamMember.create({
                data: { teamId, personId }
            });

            return res.status(201).json({ msg: "Membro adicionado ao time", member });
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ msg: "Este membro já está neste time" });
            }
            console.log(error);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    },

    // Lista todos os membros de todos os times
    getAll: async (req, res) => {
        try {
            const members = await prisma.teamMember.findMany({
                include: {
                    team: true,
                    person: true
                }
            });
            return res.status(200).json(members);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    },

    // Busca um membro específico pelo id
    getUnique: async (req, res) => {
        try {
            const { id } = req.params;
            const member = await prisma.teamMember.findUnique({
                where: { id: Number(id) },
                include: {
                    team: true,
                    person: true
                }
            });
            if (!member) {
                return res.status(404).json({ msg: "Membro não encontrado" });
            }
            return res.status(200).json(member);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    },

    // Atualiza o time ou pessoa de um membro
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { teamId, personId } = req.body;

            if (!teamId || !personId) {
                return res.status(400).json({ msg: "teamId e personId são obrigatórios" });
            }

            const member = await prisma.teamMember.update({
                where: { id: Number(id) },
                data: { teamId, personId }
            });

            return res.status(200).json({ msg: "Membro atualizado", member });
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ msg: "Este membro já está neste time" });
            }
            console.log(error);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    },

    // Remove um membro do time
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.teamMember.delete({
                where: { id: Number(id) }
            });
            return res.status(200).json({ msg: "Membro removido do time" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }
};

module.exports = teamMemberController;

