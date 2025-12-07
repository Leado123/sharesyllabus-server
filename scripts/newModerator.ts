import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

let username = Bun.argv[2];
let password = Bun.argv[3];
let priviledge = Bun.argv[4];

try {
    let newModerator = await prisma.moderator.create({
        data: {
            username: username,
            password: await argon2.hash(password),
        }
    });
    console.log(`Successfully created new moderator with username: ${username} and id: ${newModerator.id}`);
} catch (e) {
    console.error(e);
}