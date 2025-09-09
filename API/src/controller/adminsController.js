const { PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();


const adminsController = {

    // Create a new admin 
    create: async (req, res) => {

        try {
            const { name, cpf, email, phone, birthDate, password} = req.body;

            if (!name || !cpf || !email || !phone || !birthDate || !password) {
                return res.status(400).json({
                    msg: "Todos os campos são obrigatórios"
                });
            };
           
             const hashedPassword = await bcrypt.hash(password, 10);

            const adminsCreated = await prisma.adimins.create({
                data: {
                    name, cpf, email, phone, birthDate: new Date(birthDate), password: hashedPassword
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
    }}
