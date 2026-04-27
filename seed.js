// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  // await db.collection('users').deleteMany({});
  // await db.collection('projects').deleteMany({});
  // await db.collection('tasks').deleteMany({});
  // await db.collection('notes').deleteMany({});

  // =============================================================================
  //  TODO: Insert your seed data below.
//   {
//   _id: ObjectId,
//   email: string (required, unique),
//   passwordHash: string (required),
//   name: string (required),
//   createdAt: Date (required)
// }
  db.users.insertmany([
    {
      email: "zunair@gmail.com",
      passwordHash: await bcrypt.hash('password123', 10),
      name: "Zunair",
      createdAt: new Date()
    },
    {
      email: "zain@gmail.com",
      passwordHash: await bcrypt.hash('password124', 10),
      name: "Zain",
      createdAt: new Date()
    },
    {
      email: "toheed@gmail.com",
      passwordHash: await bcrypt.hash('password125', 10),
      name: "Toheed",
      createdAt: new Date()
    }
  ])

//   {
//   _id: ObjectId,
//   ownerId: ObjectId (required, references users._id),
//   name: string (required),
//   description: string (optional),
//   archived: boolean (required, default: false),
//   createdAt: Date (required)
// }

db.projects.insertmany([
{
  ownerId
}

])


  //  Hints:
  //    - Hash passwords:   const hash = await bcrypt.hash('password123', 10);
  //    - Capture inserted ids:
  //        const u = await db.collection('users').insertOne({ ... });
  //        const userId = u.insertedId;
  //    - Use those ids when inserting projects/tasks/notes.
  //    - Demonstrate schema flexibility: include at least one optional field
  //      on SOME documents but not all (e.g. dueDate on some tasks only).
  //
  //  Sample task shape:
  //    {
  //      ownerId: <ObjectId>,
  //      projectId: <ObjectId>,
  //      title: "Write report introduction",
  //      status: "todo",
  //      priority: 3,
  //      tags: ["writing", "urgent"],
  //      subtasks: [
  //        { title: "Outline sections", done: true },
  //        { title: "Draft", done: false }
  //      ],
  //      createdAt: new Date()
  //    }
  // =============================================================================

  console.log('TODO: implement seed.js');
  process.exit(0);
})();
