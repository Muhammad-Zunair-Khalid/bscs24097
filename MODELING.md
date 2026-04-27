# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** — Stores registered users with their credentials. Every other collection references users via ownerId.
- **projects** — Stores projects belonging to a user. Projects can be archived but are never deleted.
- **tasks** — Stores tasks belonging to a project. Each task embeds its subtasks and tags directly inside the document.
- **notes** — Stores notes belonging to a user. Notes can optionally be linked to a project or exist as standalone notes.

---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, references users._id),
  name: string (required),
  description: string (optional),
  archived: boolean (required, default: false),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, references users._id),
  projectId: ObjectId (required, references projects._id),
  title: string (required),
  status: string (required, one of: "todo" | "in-progress" | "done"),
  priority: number (required, default: 1),
  tags: Array<string> (required, default: []),
  subtasks: Array<{ title: string, done: boolean }> (required, default: []),
  dueDate: Date (optional),
  createdAt: Date (required)
}
```

### notes
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, references users._id),
  projectId: ObjectId (optional, references projects._id),
  title: string (required),
  content: string (required),
  tags: Array<string> (required, default: []),
  createdAt: Date (required)
}
```

---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship                  | Embed or Reference? | Why? |
|-------------------------------|---------------------|------|
| Subtasks inside a task        | Embed               | Subtasks are owned exclusively by one task and always read together with it, so embedding avoids a separate query. |
| Tags on a task                | Embed               | Tags are simple strings tightly coupled to the task and never queried independently, so embedding is more efficient. |
| Project → Task ownership      | Reference           | Tasks are queried independently by project and status, so storing a projectId reference allows flexible filtering. |
| Note → optional Project link  | Reference           | The project link is optional and notes can exist without a project, so a nullable projectId reference is the right choice. |

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

> The `dueDate` field exists on some task documents but not others. In MongoDB this is perfectly acceptable because documents in the same collection do not need identical fields. This is useful because not every task has a deadline — forcing a `dueDate: null` on every task would be wasteful, whereas MongoDB simply omits the field on tasks that do not need it.
