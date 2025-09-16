const { PrismaClient } = require("@prisma/client");     
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const employeesController = {

    //Create a new employee acount
    create: async (req, res) => {

        try {
            const { name, cpf, email, phone, birthDate, password, role } = req.body;

            if (!name || !cpf || !email || !phone || !birthDate || !password || !role)  {
                return res.status(400).json({
                    msg: "All the fields are necessary"
                });
            };

            const hashedPassword = await bcrypt.hash(password, 10);

            const employeeCreated = await prisma.employees.create({
                data: {
                    name, cpf, email, phone, birthDate: new Date(birthDate), password: hashedPassword, role
                }
            });

            if (employeeCreated.role == "INSPECTOR") {
                const inspectorCreates = await prisma.inspector.create({
                    data: {
                        id: employeeCreated.id // O campo correto é 'id', não 'employeeId'
                    }
                }); 
            } else if (employeeCreated.role == "MAINTAINER") {
                const maintainerCreates = await prisma.maintainer.create({
                    data: {
                        id: employeeCreated.id // O campo correto é 'id', não 'employeeId'
                    }
                });
            } else {
                return res.status(400).json({
                    msg: "Role must be either INSPECTOR or MAINTAINER"
                });
            }

            return res.status(201).json({
                msg: "Employee created successfully",
                id: employeeCreated.id
            });

        } catch (error) {

            if (error.code === 'P2002') {
                return res.status(400).json({
                    msg: "An employee with this data already exists"
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

        const employeeFind = await prisma.employees.findUnique({
            where: { cpf }
        });

        if (!employeeFind) {
            return res.status(404).json({
                msg: "Employee not found"
            });
        }

        const passwordMatch = await bcrypt.compare(password, employeeFind.password);

        if (!passwordMatch) {
            return res.status(401).json({
                msg: "Invalid password or CPF"
            });
        }

        const payload = {
            id: employeeFind.id,
            cpf: employeeFind.cpf,
            email: employeeFind.email,
            name: employeeFind.name
        };

        const token = jwt.sign(payload, "SGNldE5pYW0=", {
            expiresIn: '1d' // Token expiration time
        });

        return res.status(200).json({
            token,
            id: employeeFind.id,
            msg: "Employee successfully authenticated"
        });
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const employeeDelete = await prisma.employees.delete({
                where: { id: Number(id) }
            })

            if (!id) {
                return res.status(400).json({
                    msg: "ID necessário",
                    employeeDelete
                })
            }

            return res.status(200).json({
                msg: "Employee deleted successfully",
            })
        } catch (error) {

            console.log(error)

            return res.status(500).json({
                msg: "Internal server error"
            })
        }

    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, cpf, email, phone, birthDate, password, role } = req.body;

            if (!name || !cpf || !email || !phone || !birthDate || !password || !role) {
                return res.status(400).json({
                    msg: 'All fields (including role) are necessary'
                });
            }

            await prisma.employees.update({
                data: {
                    name,
                    cpf,
                    email,
                    phone,
                    birthDate: new Date(birthDate),
                    password,
                    role
                },
                where: {
                    id: Number(id)
                }
            });

            return res.status(200).json({
                msg: 'Employee updated successfully',
            });
        } catch (error) {
            console.log(error)

            return res.status(500).json({
                msg: "Internal server error"
            })
        }
    },

    getAll: async (req, res) => {
        try {
            const employees = await prisma.employees.findMany();

            return res.json(employees)

        } catch (error) {
            console.log("Error searching for employees:", error)
        }
    },

    getUnique: async (req, res) => {
        try {
            const { id } = req.params

            const employee = await prisma.employees.findUnique({
                where: { id: Number(id) }
            })

            if (!employee) {
                return res.status(404).json({ error: "Employee not found" })
            }

            return res.status(200).json(employee)
        } catch (error) {
            
            console.log("Error searching for employee:", error)
        }
    }
}

module.exports = employeesController;


/*
{
  "name": "Maria Souza",
  "cpf": "98765432100",
  "email": "maria.souza@example.com",
  "phone": "21 98888-7777",
  "birthDate": "1995-03-25",
  "password": "senhaForte456",
  "role": "MAINTAINER"
}
*/ 
