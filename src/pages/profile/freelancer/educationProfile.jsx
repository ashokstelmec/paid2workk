"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { Plus, ChevronDown, Trash2 } from "lucide-react";

export default function Education() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      school: "New York University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      from: "2017-09",
      to: "2021-06",
      current: false,
      description:
        "Major in Software Engineering with focus on Web Technologies",
    },
  ]);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: entries.length + 1,
        school: "",
        degree: "",
        field: "",
        from: "",
        to: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleChange = (id, field, value) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  return (
    <div className="space-y-4 p-5">
      {entries.map((entry, index) => (
        <Accordion
          sx={{
            borderRadius: 2,
          }}
          key={entry.id}
          defaultExpanded={true}
        >
          <AccordionSummary expandIcon={<ChevronDown size={20} />}>
            <Typography>Education {index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextField
                  fullWidth
                  label="School"
                  value={entry.school}
                  onChange={(e) =>
                    handleChange(entry.id, "school", e.target.value)
                  }
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Degree"
                  value={entry.degree}
                  onChange={(e) =>
                    handleChange(entry.id, "degree", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <TextField
                  fullWidth
                  label="Field of Study"
                  value={entry.field}
                  onChange={(e) =>
                    handleChange(entry.id, "field", e.target.value)
                  }
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="From"
                  type="month"
                  value={entry.from}
                  onChange={(e) =>
                    handleChange(entry.id, "from", e.target.value)
                  }
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  label="To"
                  type="month"
                  value={entry.to}
                  onChange={(e) => handleChange(entry.id, "to", e.target.value)}
                  disabled={entry.current}
                />
              </div>
              <div className="md:col-span-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={entry.current}
                      onChange={(e) =>
                        handleChange(entry.id, "current", e.target.checked)
                      }
                    />
                  }
                  label="I currently study here"
                />
              </div>
              <div className="md:col-span-2">
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={entry.description}
                  onChange={(e) =>
                    handleChange(entry.id, "description", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <IconButton onClick={() => removeEntry(entry.id)} color="error">
                  <Trash2 size={20} />
                </IconButton>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}

      <Button
        startIcon={<Plus size={20} />}
        onClick={addEntry}
        variant="outlined"
        color="blue"
      >
        Add Education
      </Button>

      <div className="flex justify-end gap-4 mt-4">
        <Button variant="outlined" color="error">
          Cancel
        </Button>
        <Button variant="contained" color="blue">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
