const jwt = require("jsonwebtoken");

const classifyRequest = require("../services/aiService");

let requests = [];

let notes = [];


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

  const request = {
    id: requests.length + 1,
    customerName,
    message,
    status: "queued",
    createdAt: new Date(),
  };

  requests.push(request);

  res.status(201).json({
    message: "Request created",
    request,
  });

  setTimeout(() => {
    const aiResult = classifyRequest(message);

    request.aiClassification = aiResult;

    request.status = "classified";

    console.log(
      `Request ${request.id} classified`
    );
  }, 3000);
};


// GET ALL REQUESTS

exports.getRequests = async (req, res) => {
  res.json(requests);
};


// GET REQUEST BY ID

exports.getRequestById = async (req, res) => {
  const id = Number(req.params.id);

  const request = requests.find(
    (r) => r.id === id
  );

  if (!request) {
    return res.status(404).json({
      message: "Request not found",
    });
  }

  const requestNotes = notes.filter(
    (note) => note.requestId === id
  );

  res.json({
    request,
    notes: requestNotes,
  });
};


// UPDATE STATUS

exports.updateStatus = async (req, res) => {
  const id = Number(req.params.id);

  const { status } = req.body;

  const request = requests.find(
    (r) => r.id === id
  );

  if (!request) {
    return res.status(404).json({
      message: "Request not found",
    });
  }

  request.status = status;

  res.json({
    message: "Status updated",
    request,
  });
};


// ADD NOTE

exports.addNote = async (req, res) => {
  const id = Number(req.params.id);

  const { note } = req.body;

  const newNote = {
    id: notes.length + 1,
    requestId: id,
    note,
    createdAt: new Date(),
  };

  notes.push(newNote);

  res.status(201).json({
    message: "Note added",
    note: newNote,
  });
};