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

  // Clear existing data so re-seeding is idempotent
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

// users
  const u1 = await db.collection('users').insertOne({
    name: 'Zunair Khalid',
    email: 'zunair@gmail.com',
    passwordHash: await bcrypt.hash('password123', 10),
    createdAt: new Date()
  });

  const u2 = await db.collection('users').insertOne({
    name: 'Zain Ali',
    email: 'zain@gmail.com',
    passwordHash: await bcrypt.hash('password456', 10),
    createdAt: new Date()
  });

  

  //projects
  const p1 = await db.collection('projects').insertOne({
    ownerId: u1.insertedId,
    name: 'Web Development',
    description: 'Build a portfolio website',
    archived: false,
    createdAt: new Date()
  });

  const p2 = await db.collection('projects').insertOne({
    ownerId: u1.insertedId,
    name: 'Database Course',
    description: 'ADBMS assignments and labs',
    archived: false,
    createdAt: new Date()
  });

  const p3 = await db.collection('projects').insertOne({
    ownerId: u2.insertedId,
    name: 'ML Research',
    description: 'Machine learning paper research',
    archived: false,
    createdAt: new Date()
  });

  const p4 = await db.collection('projects').insertOne({
    ownerId: u2.insertedId,
    name: 'Mobile App',
    description: 'Flutter based mobile app',
    archived: false,
    createdAt: new Date()
  });

  // tasks
  await db.collection('tasks').insertMany([
    {
      ownerId: u1.insertedId,
      projectId: p1.insertedId,
      title: 'Design homepage',
      status: 'todo',
      priority: 1,
      tags: ['design', 'urgent'],
      subtasks: [
        { title: 'Make wireframe', done: true },
        { title: 'Choose color scheme', done: false }
      ],
      dueDate: new Date('2025-05-01'), 
      createdAt: new Date()
    },
    {
      ownerId: u1.insertedId,
      projectId: p1.insertedId,
      title: 'Build navbar',
      status: 'in-progress',
      priority: 2,
      tags: ['frontend'],
      subtasks: [
        { title: 'HTML structure', done: true },
        { title: 'Add CSS styling', done: false }
      ],
      createdAt: new Date() 
    },
    {
      ownerId: u1.insertedId,
      projectId: p2.insertedId,
      title: 'Complete NoSQL lab',
      status: 'in-progress',
      priority: 1,
      tags: ['database', 'urgent'],
      subtasks: [
        { title: 'Write seed.js', done: true },
        { title: 'Implement queries', done: false }
      ],
      dueDate: new Date('2025-04-27'),
      createdAt: new Date()
    },
    {
      ownerId: u2.insertedId,
      projectId: p3.insertedId,
      title: 'Read research papers',
      status: 'done',
      priority: 2,
      tags: ['research'],
      subtasks: [
        { title: 'Find papers', done: true },
        { title: "Summarize findings", done: true }
      ],
      createdAt: new Date()
    },
    {
      ownerId: u2.insertedId,
      projectId: p3.insertedId,
      title: 'Write literature review',
      status: 'todo',
      priority: 3,
      tags: ['writing', 'research'],
      subtasks: [
        { title: 'Draft introduction', done: false },
        { title: 'Add citations', done: false }
      ],
      createdAt: new Date()
    }
  ]);

  
 // notes

  await db.collection('notes').insertMany([
    {
      ownerId: u1.insertedId,
      projectId: p1.insertedId, 
      title: 'Design ideas',
      content: 'Use dark theme with green accents',
      tags: ['design', 'ideas'],
      createdAt: new Date()
    },
    {
      ownerId: u1.insertedId,
      projectId: p2.insertedId, 
      title: 'MongoDB tips',
      content: 'Remember to use $addToSet instead of $push for unique values',
      tags: ['database', 'tips'],
      createdAt: new Date()
    },
    {
      ownerId: u1.insertedId, 
      title: 'General thoughts',
      content: 'Standalone note with no project attached',
      tags: ['personal'],
      createdAt: new Date()
    },
    {
      ownerId: u2.insertedId,
      projectId: p3.insertedId, 
      title: 'ML resources',
      content: 'Check arxiv for latest papers on transformers',
      tags: ['research', 'ml'],
      createdAt: new Date()
    },
    {
      ownerId: u2.insertedId, 
      title: 'Meeting notes',
      content: 'Discuss project progress on Monday',
      tags: ['meeting', 'personal'],
      createdAt: new Date()
    }
  ]);



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



  console.log('Database seeded successfully!');
  process.exit(0);
})();