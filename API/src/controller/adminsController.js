const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');


const adminsController = {

    // Create a new admin 
    create: async (req, res) => {

        try {
            const { name, cpf, email, phone, birthDate, password } = req.body;

            if (!name || !cpf || !email || !phone || !birthDate || !password) {
                return res.status(400).json({
                    msg: "Todos os campos são obrigatórios"
                });
            };

            const hashedPassword = await bcrypt.hash(password, 10);

            const adminsCreated = await prisma.admins.create({
                data: {
                    name, 
                    cpf, 
                    email, 
                    phone, 
                    birthDate: new Date(birthDate), 
                    password: hashedPassword,
                    teamId: 1
                }
            });

            return res.status(201).json({
                msg: "Admin created successfully",
                id: adminsCreated.id
            });
        } catch (error) {

            if (error.code === 'P2002') {
                return res.status(400).json({
                    msg: "An admin with this data already exists"
                });
            }

            console.log(error);

            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    },

    login: async (req, res) => {

        const { cpf, password } = req.body;

        if (!cpf || !password) {
            return res.status(400).json({
                msg: "CPF and password are required"
            });
        }

        const adminFind = await prisma.admins.findUnique({
            where: { cpf }
        });

        if (!adminFind) {
            return res.status(404).json({
                msg: "Admin not found"
            });
        }

        const passwordMatch = await bcrypt.compare(password, adminFind.password);

        if (!passwordMatch) {
            return res.status(401).json({
                msg: "Invalid password or CPF"
            });
        }

        const payload = {
            id: adminFind.id,
            name: adminFind.name,
            cpf: adminFind.cpf,
            email: adminFind.email
        };

        const token = jwt.sign(payload, "SGNldE5pYW0=", {
            expiresIn: '1d'
        });

        return res.status(200).json({
            token,
            id: adminFind.id,
            msg: "Admin authenticated successfully"
        });
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, cpf, email, phone, birthDate, password } = req.body;

            if (!name || !cpf || !email || !phone || !birthDate || !password) {
                return res.status(400).json({
                    msg: "All fields are required"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.admins.update({
                where: { id: Number(id) },
                data: { name, cpf, email, phone, birthDate: new Date(birthDate), password: hashedPassword, teamId: 1 }
            });

            return res.status(200).json({
                msg: "Admin updated successfully"
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

            const adminDelete = await prisma.admins.delete({
                where: { id: Number(id) }
            });

            if (!id) {
                return res.status(400).json({
                    msg: "ID is required"
                });
            }

            return res.status(200).json({
                msg: "Admin deleted successfully",
                adminDelete
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
            const admins = await prisma.admins.findMany();
            return res.status(200).json(admins);
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
            const admin = await prisma.admins.findUnique({
                where: { id: Number(id) }
            });

            if (!admin) {
                return res.status(404).json({
                    msg: "Admin not found"
                });
            }

            return res.status(200).json(admin);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }
}


module.exports = adminsController;



/*
{
"name": "Marcos",
"cpf": "11122233345",
"email": "marcos@example.com",
"password": "senhaSegura123",
"phone": "11 91234-5678",
"birthDate": "2000-05-10",
} 
*/