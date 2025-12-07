import { PrismaClient, type Syllabus } from "@prisma/client";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import http from "node:http";
import fuzzysort from "fuzzysort";
import mime from "mime-types";
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { idText } from "typescript";
import 'dotenv/config';
import { jwtMiddleware } from "./authMiddleware";
import uploadSyllabus from "./entities/uploadSyllabus";

import gql from "graphql-tag";

const schema = gql`
    {
       type Amazing {
       } 
    }
`
const app = express();
const httpServer = http.createServer(app);

export const prisma = new PrismaClient();

app.use(cors({
    origin: "*", // TODO change this to the actual domain
}))

app.use(express.json());

app.use(fileUpload());

app.use('/files', express.static('syllabi'));

app.use('/create', uploadSyllabus)

app.get("/schools", async (req, res) => {
    let colleges = await prisma.school.findMany({});
    res.json(colleges);
})

app.post("/search/class/", async (req, res) => {
    let take = req.body.take || 10;
    let skip = req.body.skip || 0;

    if (await prisma.school.findUnique({ where: { name: req.query.s as string } }) === null) return res.status(404).json({ msg: "School not found" });

    let classes = await prisma.class.findMany({
        where: {
            school: {
                name: req.query.s as string,
            },
        },
    });


    let results = classes;

    if (req.query.q) {
        results = fuzzysort.go(req.query.q as string, classes, { keys: ["className", "fullClassName"] }).map(i => i.obj);
    }


    res.json(results.slice(skip, skip + take));
});

app.post("/search/professor/", async (req, res) => {
    let take = req.body.take || 10;
    let skip = req.body.skip || 0;

    if (await prisma.school.findUnique({ where: { name: req.query.s as string } }) === null) return res.status(404).json({ msg: "School not found" });

    let professors = await prisma.professor.findMany({
        where: {
            school: {
                name: req.query.s as string,
            },
        },
    });

    let results = professors;

    if (req.query.q) {
        results = fuzzysort.go(req.query.q as string, professors, { keys: ["name"] }).map(i => i.obj);
    }

    res.json(results.slice(skip, skip + take));
});

app.get("/professor/:id", async (req, res) => {
    let professor = await prisma.professor.findUnique({
        where: { id: req.params.id },
        include: {
            school: true,
            syllabi: {
                include: {
                    class: true,
                },
            },
        },
    });
    if (professor === null) return res.status(404).json({ msg: "Professor not found" });
    return res.json({
        name: professor.name,
        school: professor.school?.name,
        syllabi: professor.syllabi.map(i => {
            return {
                id: i.id,
                className: i.class?.className,
                fullClassName: i.fullClassName,
                textbookCost: i.textbookCost,
                classLength: i.classLength,
                description: i.description,
                dateCreated: i.dateCreated.toISOString(),
                fileName: `${i.id}.${mime.extension(i.mimeType)}`,
            };
        }),
    });
});

app.get("/syllabus/:id", async (req, res) => {
    let syllabus = await prisma.syllabus.findUnique({
        where: { id: req.params.id, reviewed: true },
        include: {
            class: {
                include: {
                    discipline: true,
                },
            },
            professorObject: true,
        },
    });
    if (syllabus === null) return res.status(404).json({ msg: "Syllabus not found" });
    return res.json({
        className: syllabus.class?.className,
        description: syllabus.description,
        fullClassName: syllabus.fullClassName,
        textbookCost: syllabus.textbookCost,
        content: syllabus.content,
        classLength: syllabus.classLength,
        professor: syllabus.professorObject?.name,
        dateCreated: syllabus.dateCreated.toISOString(),
        fileName: `${syllabus.id}.${mime.extension(syllabus.mimeType)}`,
        class: {
            className: syllabus.class?.className ?? '',
            fullClassName: syllabus.class?.fullClassName ?? '',
            discipline: syllabus.class?.discipline?.name ?? '',
        },
    });
});

app.get("/syllabus/:id/download", async (req, res) => {
    let syllabus = await prisma.syllabus.findUnique({
        where: { id: req.params.id, reviewed: true },
        include: {
            class: true,
        },
    });
    if (syllabus === null) return res.status(404).json({ msg: "Syllabus not found" });
    res.download(`./syllabi/${syllabus.id}.${mime.extension(syllabus.mimeType)}`);
});

app.get("/search/", async (req, res) => {
    try {
        let syllabi = await prisma.syllabus.findMany({
            include: {
                class: {
                    include: {
                        discipline: true,
                    },
                },
                professorObject: true,
                school: true,
            },
        });

        let results = syllabi;

        if (req.query.s) {
            results = results.filter(i => i.school?.name === req.query.s);
        }

        if (req.query.c) {
            results = results.filter(i => i.class?.className === req.query.c);
        }

        if (req.query.p) {
            results = results.filter(i => i.professorObject?.name === req.query.p);
        }

        if (req.query.q) {
            results = fuzzysort.go(req.query.q as string, results, { keys: ["class.className", "professorObject.name", "class.fullClassName"] }).map(i => i.obj);
        }

        let take = req.query.take as unknown as number || 10;
        let skip = req.query.skip as unknown as number || 0;

        res.json(results.map(i => {
            return {
                id: i.id,
                className: i.class?.className,
                professor: i.professorObject?.name ?? '',
                fullClassName: i.fullClassName,
                textbookCost: i.textbookCost,
                description: i.description,
                classLength: i.classLength,
                dateCreated: i.dateCreated.toISOString(),
                fileName: `${i.id}.${mime.extension(i.mimeType)}`,
                class: {
                    className: i.class?.className ?? '',
                    fullClassName: i.class?.fullClassName ?? '',
                    discipline: i.class?.discipline?.name ?? '',
                },
                professorId: i.professorObject?.id ?? '',
                school: {
                    name: i.school?.name ?? '',
                    id: i.school?.id ?? '',
                    fullName: i.school?.fullName ?? '',
                }
            };
        }).slice(skip).slice(0, take));
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.post("/report/:id", async (req, res) => {
    try {
        const { reportType, reportTitle, reportBody, reportBy } = req.body;
        const syllabusId = req.params.id;

        // Check if the syllabus exists
        const syllabus = await prisma.syllabus.findUnique({ where: { id: syllabusId } });
        if (!syllabus) {
            return res.status(404).json({ msg: "Syllabus not found" });
        }

        // Create the report
        const report = await prisma.report.create({
            data: {
                reportType,
                reportTitle,
                reportBody,
                reportBy,
                syllabusId,
            },
        });

        res.json(report);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: `Internal Server Error ${e}` });
    }
})

app.post("/moderator/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ msg: "Missing username or password" });
    }

    const moderator = await prisma.moderator.findUnique({ where: { username } });
    if (!moderator) {     
        return res.status(401).json({ msg: "Invalid username or password" });
    }

    const valid = await argon2.verify(moderator.password, password);
    if (!valid) {
        return res.status(401).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign({ id: moderator.id }, process.env.SECRET_KEY as string, { expiresIn: '2h' });
    
    res.json({ token });
    return;
});

app.post("/moderator/check", jwtMiddleware, async (req, res) => {
    res.json({ id: req.params.userId});
});

app.post("/moderator/flag", jwtMiddleware, async (req, res) => {
    res.json(req.body);
});

await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000, host: "0.0.0.0" }, resolve)
);

