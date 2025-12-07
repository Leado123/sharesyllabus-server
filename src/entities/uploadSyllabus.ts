import { Router } from "express";
import fileUpload from "express-fileupload";
import mime from "mime";
import { prisma } from "..";

const router = Router();

router.get("/", async (req, res) => {
  if (req.files === null || req.files === undefined)
    return res.status(400).json({ msg: "No file uploaded" });
  if (req.files.upload === null)
    return res.status(400).json({ msg: "No file uploaded" });
  if (Array.isArray(req.files.upload))
    return res.status(400).json({ msg: "Multiple files uploaded" });
  const file = req.files.upload as fileUpload.UploadedFile;

  if (![mime.lookup(".pdf"), mime.lookup(".docx")].includes(file.mimetype))
    return res.status(400).json({ msg: "Invalid file type" });
  if (file.size > 5_000_000) {
    return res.status(400).json({ msg: "File too large (max 5MB)" });
  }

  // Add error handling for missing required fields
  if (!req.body.schoolName || !req.body.className || !req.body.professor) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  // Add proper error handling for file operations
  try {
    let school = await prisma.school.findUnique({
      where: { name: req.body.schoolName },
    });

    if (!school) {
      return res.status(404).json({ msg: "School not found" });
    }

    let classRecord = await prisma.class.findFirst({
      // Change findUnique to findFirst
      where: {
        className: req.body.className,
        schoolId: school.id,
      },
    });

    if (!classRecord) {
      return res.status(404).json({ msg: "Class not found" });
    }

    let professorObject = await prisma.professor.findUnique({
      where: { name: req.body.professor },
    });

    if (!professorObject) {
      professorObject = await prisma.professor.create({
        data: {
          name: req.body.professor,
          schoolId: school.id,
        },
      });
    }
    let { id } = await prisma.syllabus.create({
      data: {
        mimeType: file.mimetype,
        professor: req.body.professor, // Required string field
        createdByName: req.body.name || undefined,
        createdByEmail: req.body.email || undefined,
        fullClassName: req.body.fullClassName || undefined,
        classLength: req.body.classLength
          ? parseInt(req.body.classLength, 10)
          : undefined,
        textbookCost: req.body.textbookCost || undefined,
        description: req.body.description || undefined,
        content: "", // Add the content property
        class: { connect: { id: classRecord.id } },
        Professor: { connect: { id: professorObject.id } },
        school: { connect: { id: school.id } },
      },
    });

    await file.mv(`./syllabi/${id}.${mime.extension(file.mimetype)}`);
    return res.status(200).json({ id });
  } catch (error) {
    console.error("Error creating syllabus:", error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ msg: "Internal server error", error: error.message });
    }
    return res.status(500).json({ msg: "Internal server error" });
  }
});

export default router;
