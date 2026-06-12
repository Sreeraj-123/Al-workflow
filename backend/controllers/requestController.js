const jwt = require("jsonwebtoken");
const db = require("../config/db");

const classifyRequest = require("../services/aiServices");

// LOGIN

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (
    email === "admin@gmail.com" &&
    password === "admin123"
  ) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  }

  res.status(401).json({
    message: "Invalid credentials",
  });
};


// CREATE REQUEST

exports.createRequest = async (req, res) => {
  const { customerName, message } = req.body;

  const db = require("../config/db");

  const [result] = await db.query(
    `
    INSERT INTO customer_requests
    (customer_name,message,status)
    VALUES (?,?,?)
    `,
    [customerName, message, "queued"]
  );

  const requestId = result.insertId;

  res.status(201).json({
    message: "Request created",
    id: requestId,
  });
  setTimeout(async () => {
  const aiResult = classifyRequest(message);

  await db.query(
    `
    UPDATE customer_requests
    SET status = ?
    WHERE id = ?
    `,
    ["classified", requestId]
  );

  console.log(
    `Request ${requestId} classified`
  );

  await db.query(
  `
  INSERT INTO ai_classifications
  (
    request_id,
    category,
    priority,
    summary,
    confidence
  )
  VALUES (?,?,?,?,?)
  `,
  [
    requestId,
    aiResult.category,
    aiResult.priority,
    aiResult.summary,
    aiResult.confidence
  ]
);
}, 3000);
};


// GET ALL REQUESTS

exports.getRequests = async (req, res) => {
  const [requests] = await db.query(
  `
  SELECT *
  FROM customer_requests
  ORDER BY created_at DESC
  `
  );

res.json(requests);
};


// GET REQUEST BY ID

exports.getRequestById = async (req, res) => {
  const id = req.params.id;

  const [requests] = await db.query(
    `
    SELECT *
    FROM customer_requests
    WHERE id = ?
    `,
    [id]
  );

  if (requests.length === 0) {
    return res.status(404).json({
      message: "Request not found",
    });
  }

  const request = requests[0];

  const [notes] = await db.query(
    `
    SELECT *
    FROM internal_notes
    WHERE request_id = ?
    `,
    [id]
  );

  res.json({
    request,
    notes,
  });
};


// UPDATE STATUS

exports.updateStatus = async (req, res) => {
  const id = req.params.id;

  const { status } = req.body;

  await db.query(
    `
    UPDATE customer_requests
    SET status = ?
    WHERE id = ?
    `,
    [status, id]
  );

  res.json({
    message: "Status updated",
  });
};


// ADD NOTE

exports.addNote = async (req, res) => {
  const id = req.params.id;

  const { note } = req.body;

  await db.query(
    `
    INSERT INTO internal_notes
    (request_id,note)
    VALUES (?,?)
    `,
    [id, note]
  );

  res.status(201).json({
    message: "Note added",
  });
};