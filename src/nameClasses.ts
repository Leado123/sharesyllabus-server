import { PrismaClient, TextbookCost } from "@prisma/client";

const prisma = new PrismaClient();

// Random data generators
const firstNames = [
  "James",
  "Mary",
  "Robert",
  "Patricia",
  "John",
  "Jennifer",
  "Michael",
  "Linda",
  "David",
  "Elizabeth",
  "William",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Christopher",
  "Karen",
  "Charles",
  "Lisa",
  "Daniel",
  "Nancy",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Mark",
  "Sandra",
  "Donald",
  "Ashley",
  "Steven",
  "Kimberly",
  "Paul",
  "Emily",
  "Andrew",
  "Donna",
  "Joshua",
  "Michelle",
  "Kenneth",
  "Dorothy",
  "Kevin",
  "Carol",
  "Brian",
  "Amanda",
  "George",
  "Melissa",
  "Timothy",
  "Deborah",
  "Ronald",
  "Stephanie",
  "Edward",
  "Rebecca",
  "Jason",
  "Sharon",
  "Wei",
  "Yuki",
  "Raj",
  "Priya",
  "Ahmed",
  "Fatima",
  "Carlos",
  "Maria",
  "Hiroshi",
  "Mei",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Chen",
  "Patel",
  "Kim",
  "Singh",
  "Tanaka",
  "Yamamoto",
  "Müller",
  "Schmidt",
  "O'Brien",
  "Murphy",
  "Cohen",
  "Rosenberg",
  "Sharma",
  "Gupta",
  "Wang",
  "Zhang",
];

const schools = [
  { name: "SJCC", fullName: "San Jose City College" },
  { name: "SJSU", fullName: "San Jose State University" },
  { name: "Stanford", fullName: "Stanford University" },
  { name: "Berkeley", fullName: "University of California, Berkeley" },
  { name: "UCLA", fullName: "University of California, Los Angeles" },
  { name: "MIT", fullName: "Massachusetts Institute of Technology" },
  { name: "Harvard", fullName: "Harvard University" },
  { name: "Yale", fullName: "Yale University" },
  { name: "Princeton", fullName: "Princeton University" },
  { name: "Columbia", fullName: "Columbia University" },
  { name: "DeAnza", fullName: "De Anza College" },
  { name: "Foothill", fullName: "Foothill College" },
  { name: "UCSC", fullName: "University of California, Santa Cruz" },
  { name: "UCSF", fullName: "University of California, San Francisco" },
  { name: "CalPoly", fullName: "California Polytechnic State University" },
  { name: "USC", fullName: "University of Southern California" },
  { name: "UCSD", fullName: "University of California, San Diego" },
  { name: "UCI", fullName: "University of California, Irvine" },
  { name: "UCD", fullName: "University of California, Davis" },
  { name: "CSUEB", fullName: "California State University, East Bay" },
];

const disciplines = [
  { name: "Mathematics", prefix: "MAT" },
  { name: "English", prefix: "ENG" },
  { name: "Physics", prefix: "PHY" },
  { name: "Chemistry", prefix: "CHE" },
  { name: "Biology", prefix: "BIO" },
  { name: "Computer Science", prefix: "CS" },
  { name: "Psychology", prefix: "PSY" },
  { name: "Sociology", prefix: "SOC" },
  { name: "History", prefix: "HIS" },
  { name: "Philosophy", prefix: "PHI" },
  { name: "Economics", prefix: "ECO" },
  { name: "Political Science", prefix: "POL" },
  { name: "Art", prefix: "ART" },
  { name: "Music", prefix: "MUS" },
  { name: "Communications", prefix: "COM" },
  { name: "Anthropology", prefix: "ANT" },
  { name: "Geography", prefix: "GEG" },
  { name: "Spanish", prefix: "SPA" },
  { name: "French", prefix: "FRE" },
  { name: "Chinese", prefix: "CHI" },
  { name: "Business", prefix: "BUS" },
  { name: "Engineering", prefix: "ENGR" },
  { name: "Nursing", prefix: "NUR" },
  { name: "Education", prefix: "EDU" },
  { name: "Kinesiology", prefix: "KIN" },
];

const classTemplates: { [key: string]: string[] } = {
  MAT: [
    "Calculus I",
    "Calculus II",
    "Calculus III",
    "Linear Algebra",
    "Differential Equations",
    "Discrete Mathematics",
    "Statistics",
    "College Algebra",
    "Precalculus",
    "Number Theory",
    "Abstract Algebra",
    "Real Analysis",
    "Complex Analysis",
    "Probability Theory",
  ],
  ENG: [
    "English Composition",
    "Critical Thinking and Writing",
    "Introduction to Literature",
    "Creative Writing",
    "Technical Writing",
    "American Literature",
    "British Literature",
    "World Literature",
    "Shakespeare",
    "Poetry Workshop",
    "Fiction Writing",
    "Rhetoric",
  ],
  PHY: [
    "General Physics I",
    "General Physics II",
    "Mechanics",
    "Electricity and Magnetism",
    "Thermodynamics",
    "Quantum Mechanics",
    "Optics",
    "Modern Physics",
    "Astrophysics",
    "Nuclear Physics",
    "Particle Physics",
    "Classical Mechanics",
  ],
  CHE: [
    "General Chemistry I",
    "General Chemistry II",
    "Organic Chemistry I",
    "Organic Chemistry II",
    "Biochemistry",
    "Analytical Chemistry",
    "Physical Chemistry",
    "Inorganic Chemistry",
    "Environmental Chemistry",
    "Medicinal Chemistry",
  ],
  BIO: [
    "General Biology",
    "Human Anatomy",
    "Human Physiology",
    "Microbiology",
    "Genetics",
    "Cell Biology",
    "Molecular Biology",
    "Ecology",
    "Evolution",
    "Botany",
    "Zoology",
    "Marine Biology",
    "Neuroscience",
    "Immunology",
  ],
  CS: [
    "Introduction to Programming",
    "Data Structures",
    "Algorithms",
    "Computer Architecture",
    "Operating Systems",
    "Database Systems",
    "Software Engineering",
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Networks",
    "Cybersecurity",
    "Web Development",
    "Mobile App Development",
    "Computer Graphics",
    "Distributed Systems",
  ],
  PSY: [
    "Introduction to Psychology",
    "Developmental Psychology",
    "Abnormal Psychology",
    "Social Psychology",
    "Cognitive Psychology",
    "Research Methods",
    "Biological Psychology",
    "Personality Psychology",
    "Clinical Psychology",
    "Industrial Psychology",
  ],
  SOC: [
    "Introduction to Sociology",
    "Social Problems",
    "Criminology",
    "Race and Ethnicity",
    "Gender Studies",
    "Family Sociology",
    "Urban Sociology",
    "Research Methods",
    "Social Stratification",
    "Sociology of Religion",
  ],
  HIS: [
    "World History I",
    "World History II",
    "United States History I",
    "United States History II",
    "Western Civilization",
    "Ancient History",
    "Medieval History",
    "Modern Europe",
    "Asian History",
    "Latin American History",
    "African History",
  ],
  PHI: [
    "Introduction to Philosophy",
    "Ethics",
    "Logic",
    "Political Philosophy",
    "Aesthetics",
    "Philosophy of Mind",
    "Philosophy of Science",
    "Ancient Philosophy",
    "Modern Philosophy",
    "Eastern Philosophy",
    "Philosophy of Religion",
    "Existentialism",
  ],
  ECO: [
    "Principles of Microeconomics",
    "Principles of Macroeconomics",
    "Intermediate Microeconomics",
    "Intermediate Macroeconomics",
    "Econometrics",
    "International Economics",
    "Labor Economics",
    "Public Finance",
    "Money and Banking",
    "Economic Development",
  ],
  POL: [
    "Introduction to Political Science",
    "American Government",
    "Comparative Politics",
    "International Relations",
    "Political Theory",
    "Public Policy",
    "Constitutional Law",
    "Political Campaigns",
    "Environmental Politics",
    "Middle Eastern Politics",
  ],
  ART: [
    "Art Appreciation",
    "Drawing I",
    "Drawing II",
    "Painting I",
    "Painting II",
    "Sculpture",
    "Art History I",
    "Art History II",
    "Digital Art",
    "Photography",
    "Ceramics",
    "Printmaking",
  ],
  MUS: [
    "Music Appreciation",
    "Music Theory I",
    "Music Theory II",
    "History of Jazz",
    "History of Rock",
    "Music Production",
    "Choir",
    "Orchestra",
    "Band",
    "Piano",
    "Guitar",
  ],
  COM: [
    "Public Speaking",
    "Interpersonal Communication",
    "Mass Communication",
    "Journalism",
    "Media Studies",
    "Intercultural Communication",
    "Organizational Communication",
    "Persuasion",
    "Communication Theory",
    "Digital Media",
  ],
  ANT: [
    "Introduction to Anthropology",
    "Cultural Anthropology",
    "Physical Anthropology",
    "Archaeology",
    "Linguistic Anthropology",
    "Human Evolution",
    "Ethnography",
    "Native American Studies",
    "Medical Anthropology",
  ],
  GEG: [
    "Introduction to Geography",
    "World Regional Geography",
    "Physical Geography",
    "Human Geography",
    "Economic Geography",
    "Urban Geography",
    "Environmental Geography",
    "GIS and Mapping",
    "Climate and Weather",
  ],
  SPA: [
    "Elementary Spanish I",
    "Elementary Spanish II",
    "Intermediate Spanish I",
    "Intermediate Spanish II",
    "Spanish Conversation",
    "Spanish Composition",
    "Spanish Literature",
    "Spanish for Heritage Speakers",
  ],
  FRE: [
    "Elementary French I",
    "Elementary French II",
    "Intermediate French I",
    "Intermediate French II",
    "French Conversation",
    "French Literature",
  ],
  CHI: [
    "Elementary Chinese I",
    "Elementary Chinese II",
    "Intermediate Chinese I",
    "Intermediate Chinese II",
    "Chinese Conversation",
    "Chinese Culture",
  ],
  BUS: [
    "Introduction to Business",
    "Principles of Management",
    "Principles of Marketing",
    "Business Law",
    "Accounting I",
    "Accounting II",
    "Finance",
    "Entrepreneurship",
    "Business Ethics",
    "International Business",
    "Human Resource Management",
  ],
  ENGR: [
    "Introduction to Engineering",
    "Engineering Graphics",
    "Statics",
    "Dynamics",
    "Thermodynamics",
    "Fluid Mechanics",
    "Materials Science",
    "Circuit Analysis",
    "Digital Logic",
    "Control Systems",
  ],
  NUR: [
    "Fundamentals of Nursing",
    "Medical-Surgical Nursing",
    "Pediatric Nursing",
    "Psychiatric Nursing",
    "Maternal-Child Nursing",
    "Community Health Nursing",
    "Pharmacology for Nurses",
    "Nursing Ethics",
  ],
  EDU: [
    "Introduction to Education",
    "Educational Psychology",
    "Curriculum Development",
    "Classroom Management",
    "Teaching Methods",
    "Special Education",
    "Educational Technology",
    "Assessment and Evaluation",
  ],
  KIN: [
    "Introduction to Kinesiology",
    "Human Anatomy for Kinesiology",
    "Exercise Physiology",
    "Biomechanics",
    "Motor Learning",
    "Sports Psychology",
    "Nutrition for Athletes",
    "Personal Training",
    "Sports Management",
  ],
};

const descriptions = [
  "This course provides a comprehensive introduction to the fundamental concepts and theories in the field.",
  "Students will develop critical thinking and analytical skills through hands-on projects and discussions.",
  "An in-depth exploration of key topics with emphasis on practical applications and real-world examples.",
  "This course covers essential foundations and prepares students for advanced study in the discipline.",
  "Through lectures, discussions, and assignments, students will gain a thorough understanding of core principles.",
  "A survey course designed to give students broad exposure to the major themes and methodologies.",
  "Students will engage with primary sources and develop research skills applicable to further study.",
  "This course emphasizes both theoretical frameworks and practical problem-solving techniques.",
  "An introductory course suitable for majors and non-majors interested in exploring the subject.",
  "Students will learn to apply concepts to analyze contemporary issues and challenges.",
  "A rigorous course that builds foundational knowledge for upper-division coursework.",
  "This course integrates lecture material with laboratory experiences and group projects.",
  "Students will develop communication skills through writing assignments and presentations.",
  "An interdisciplinary approach connecting concepts across multiple fields of study.",
  "This course prepares students for professional careers and graduate study.",
];

const textbookCosts: TextbookCost[] = [
  "free",
  "cheap",
  "moderate",
  "expensive",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProfessorName(): string {
  return `Dr. ${randomElement(firstNames)} ${randomElement(lastNames)}`;
}

function generateClassName(prefix: string, index: number): string {
  const level = randomInt(1, 4);
  const number = level * 100 + randomInt(1, 99);
  const suffix = Math.random() > 0.8 ? "H" : ""; // 20% chance of honors
  return `${prefix}-${number}${suffix}`;
}

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await prisma.report.deleteMany({});
    await prisma.flag.deleteMany({});
    await prisma.change.deleteMany({});
    await prisma.syllabus.deleteMany({});
    await prisma.classSubmission.deleteMany({});
    await prisma.professor.deleteMany({});
    await prisma.class.deleteMany({});
    await prisma.discipline.deleteMany({});
    await prisma.school.deleteMany({});

    // Create schools
    console.log("🏫 Creating schools...");
    const createdSchools = await Promise.all(
      schools.map((school) =>
        prisma.school.create({
          data: {
            name: school.name,
            fullName: school.fullName,
          },
        }),
      ),
    );
    console.log(`   Created ${createdSchools.length} schools`);

    // Create disciplines
    console.log("📚 Creating disciplines...");
    const createdDisciplines = await Promise.all(
      disciplines.map((discipline) =>
        prisma.discipline.create({
          data: {
            name: discipline.name,
          },
        }),
      ),
    );
    console.log(`   Created ${createdDisciplines.length} disciplines`);

    // Create classes for each school and discipline
    console.log("📖 Creating classes...");
    const createdClasses: any[] = [];

    for (const school of createdSchools) {
      for (let i = 0; i < disciplines.length; i++) {
        const discipline = disciplines[i];
        const createdDiscipline = createdDisciplines[i];
        const templates = classTemplates[discipline.prefix] || [
          "Introduction to " + discipline.name,
        ];

        // Create 3-8 classes per discipline per school
        const numClasses = randomInt(3, Math.min(8, templates.length));
        const selectedTemplates = templates.slice(0, numClasses);

        for (let j = 0; j < selectedTemplates.length; j++) {
          const className = `${discipline.prefix}-${(j + 1) * 10 + randomInt(0, 9)}${Math.random() > 0.85 ? "H" : ""}`;
          const fullClassName = selectedTemplates[j];

          try {
            const createdClass = await prisma.class.create({
              data: {
                className: `${school.name}-${className}`, // Prefix with school to ensure uniqueness
                fullClassName: fullClassName,
                disciplineId: createdDiscipline.id,
                schoolId: school.id,
              },
            });
            createdClasses.push(createdClass);
          } catch (e) {
            // Skip duplicates
          }
        }
      }
    }
    console.log(`   Created ${createdClasses.length} classes`);

    // Create professors for each school
    console.log("👨‍🏫 Creating professors...");
    const createdProfessors: any[] = [];

    for (const school of createdSchools) {
      const numProfessors = randomInt(15, 40);
      const usedNames = new Set<string>();

      for (let i = 0; i < numProfessors; i++) {
        let name = generateProfessorName();
        // Ensure unique names
        while (usedNames.has(name)) {
          name = generateProfessorName();
        }
        usedNames.add(name);

        try {
          const professor = await prisma.professor.create({
            data: {
              name: `${name} (${school.name})`, // Include school for uniqueness
              schoolId: school.id,
            },
          });
          createdProfessors.push(professor);
        } catch (e) {
          // Skip duplicates
        }
      }
    }
    console.log(`   Created ${createdProfessors.length} professors`);

    // Create syllabuses
    console.log("📄 Creating syllabuses...");
    let syllabusCount = 0;

    for (const school of createdSchools) {
      const schoolClasses = createdClasses.filter(
        (c) => c.schoolId === school.id,
      );
      const schoolProfessors = createdProfessors.filter(
        (p) => p.schoolId === school.id,
      );

      if (schoolClasses.length === 0 || schoolProfessors.length === 0) continue;

      // Create 20-80 syllabuses per school
      const numSyllabi = randomInt(20, 80);

      for (let i = 0; i < numSyllabi; i++) {
        const classRecord = randomElement(schoolClasses);
        const professor = randomElement(schoolProfessors);

        try {
          await prisma.syllabus.create({
            data: {
              schoolId: school.id,
              classId: classRecord.id,
              professor: professor.name,
              reviewed: Math.random() > 0.3, // 70% reviewed
              classLength: randomElement([8, 10, 12, 15, 16, 18]),
              description: randomElement(descriptions),
              mimeType: randomElement([
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ]),
              content: `# ${classRecord.fullClassName}\n\n## Course Description\n\n${randomElement(descriptions)}\n\n## Instructor\n\n${professor.name}\n\n## Course Objectives\n\n- Understand fundamental concepts\n- Develop critical thinking skills\n- Apply knowledge to real-world problems\n- Collaborate effectively with peers`,
              textbookCost: randomElement(textbookCosts),
              fullClassName: classRecord.fullClassName,
              createdByName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
              createdByEmail: `student${randomInt(1000, 9999)}@${school.name.toLowerCase()}.edu`,
              Professor: {
                connect: { id: professor.id },
              },
            },
          });
          syllabusCount++;
        } catch (e) {
          // Skip errors
        }
      }
    }
    console.log(`   Created ${syllabusCount} syllabuses`);

    // Summary
    console.log("\n✅ Database seeding complete!");
    console.log("   Summary:");
    console.log(`   - Schools: ${createdSchools.length}`);
    console.log(`   - Disciplines: ${createdDisciplines.length}`);
    console.log(`   - Classes: ${createdClasses.length}`);
    console.log(`   - Professors: ${createdProfessors.length}`);
    console.log(`   - Syllabuses: ${syllabusCount}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
const shouldSeed = process.env.SEED_DATABASE !== "false";

if (shouldSeed) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seeding finished successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
} else {
  console.log("⏭️  Skipping database seeding (SEED_DATABASE=false)");
  process.exit(0);
}
