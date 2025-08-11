
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//add test user

// const addUser = async () => {
//     const user = await prisma.user.create({
//         data: {
//             name: "aum",
//             email: "aumtest@1234",
//             password: "12345"

//         }

//     })
//     console.log(user);

// }

// await addUser();
export default prisma;
