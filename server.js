import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST /optimize-sms route
app.post("/optimize-sms", (req, res) => {
  const { message } = req.body;

  // Simple placeholder optimization (replace with Gemini logic later)
  const optimizedMessage = message.replace(/please/gi, "");

  // Count characters
  const charactersGSM7 = message.length; // placeholder
  const charactersUnicode = message.length; // placeholder

  res.json({
    originalMessage: message,
    optimizedMessage,
    charactersGSM7,
    charactersUnicode,
    originalSegments: 1, // placeholder
    optimizedSegments: 1 // placeholder
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
