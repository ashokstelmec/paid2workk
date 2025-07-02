import { useState, useEffect } from "react"; // Add useEffect
import {
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Save, Delete, FileUpload } from "@mui/icons-material";
import { useAuth } from "../../../contexts/authContext";
import heic2any from "heic2any"; // Add this import
import DocumentFormModal from "../../../components/documents/DocumentFormModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IdentityVerification() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null); // Add this line
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    if (!user?.nUserID) return; // Ensure user ID exists

    fetchDocuments();
  }, [user?.nUserID]);

  const fetchDocuments = async () => {
    if (!user?.nUserID) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/GetDocumentsByUser?NUserID=${sessionStorage.getItem(
          "NUserID"
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      const formattedData = data.map((doc) => ({
        id: doc.docId, // Keep original docId
        docId: doc.docId, // Add explicit docId field
        docName: doc.docName || "N/A",
        docNumber: doc.docNumber || "N/A",
        issueDate: doc.issueDate ? doc.issueDate.split("T")[0] : "N/A",
        expiryDate: doc.expiryDate ? doc.expiryDate.split("T")[0] : "N/A",
        filePath: doc.filePath || "",
      }));

      // console.log("Formatted entries:", formattedData); // Debug log
      setEntries(formattedData);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setInitialData(null); // Clear initialData when modal closes
  };

  const handleModalSubmit = (formData, docId) => {
    // Refresh the documents list after update
    if (user?.nUserID) {
      fetchDocuments(); // Add this function to refresh the list
    }
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: entries.length + 1,
        documentType: "",
        documentNumber: "",
        issueDate: "",
        expiryDate: "",
        documentFile: null,
        errors: {},
        isEditing: true,
      },
    ]);
  };

  const handleEdit = (entry) => {
    // console.log("Editing entry:", entry); // Debug log
    setInitialData({
      id: entry.id,
      docName: entry.docName, // This will now be handled by DocumentFormModal
      docNumber: entry.docNumber,
      // Ensure dates are properly formatted
      issueDate: entry.issueDate?.includes("T")
        ? entry.issueDate.split("T")[0]
        : entry.issueDate,
      expiryDate: entry.expiryDate?.includes("T")
        ? entry.expiryDate.split("T")[0]
        : entry.expiryDate,
      filePath: entry.filePath,
    });
    setIsModalOpen(true);
  };

  const validateEntry = (entry) => {
    let errors = {};
    if (!entry.documentType.trim()) errors.documentType = "Required!";
    if (!entry.documentNumber.trim()) errors.documentNumber = "Required!";
    if (!entry.issueDate) errors.issueDate = "Required!";
    if (!entry.expiryDate) errors.expiryDate = "Required!";
    if (
      entry.issueDate &&
      entry.expiryDate &&
      entry.issueDate > entry.expiryDate
    )
      errors.expiryDate = "Expiry Date must be after Issue Date!";
    return errors;
  };

  const handleChange = (id, field, value) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              [field]: value,
              errors: { ...entry.errors, [field]: "" },
            }
          : entry
      )
    );
  };

  const handleUpload = async (id, file) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "image/heic",
      "image/heif",
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB

    try {
      let processedFile = file;

      // Check if file is HEIC/HEIF format
      if (file.type === "image/heic" || file.type === "image/heif") {
        const blob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });
        processedFile = new File(
          [blob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          {
            type: "image/jpeg",
          }
        );
      }

      if (!allowedTypes.includes(file.type)) {
        toast.warn(
          "Invalid file type! Only PDF, PNG, JPG, and HEIC/HEIF are allowed."
        );
        return;
      }

      if (processedFile.size > maxSize) {
        toast.warn("File size exceeds 2MB!");
        return;
      }

      setEntries(
        entries.map((entry) =>
          entry.id === id ? { ...entry, documentFile: processedFile } : entry
        )
      );
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Error processing the file. Please try another format.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Error: Document ID is undefined");
      toast.error("Error: Unable to delete document. Try again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmDelete) return;

    try {
      // console.log("Deleting document with ID:", id); // Debug log

      const response = await fetch(
        `https://paid2workk.solarvision-cairo.com/DeleteDocument?DocId=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      // Remove the deleted document from state and refresh list
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
      await fetchDocuments(); // Refresh the list

      toast.success("Document deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting document. Please try again.");
    }
  };

  return (
    <div className="px-5">
      <div className="flex w-full items-center justify-between mb-3">
        <h6 className="font-medium">Add Details</h6>

        {/* 📌 Add Document Button */}
        <Button
          size="small"
          variant="outlined"
          color="blue"
          startIcon={<Add />}
          onClick={handleAddNew}
          style={{ marginBottom: "10px" }}
          sx={{ color: "blue" }}
        >
          Add Document
        </Button>
      </div>

      {/* 📌 Document Form Modal */}
      <DocumentFormModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={initialData}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: "6rem" }}
      />

      {/* 📌 Loading/Error Handling */}
      {loading && (
        <div className="w-full py-8 flex items-center justify-center">
          <Typography>Loading documents...</Typography>
        </div>
      )}
      {error && (
        <div className="w-full py-8 flex items-center justify-center">
          <Typography color="error">{error}</Typography>
        </div>
      )}

      {/* 📌 Documents Table */}
      {!loading && !error && entries.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#0b64fc" }}>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  S. No.
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Document Type
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Document Number
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Issue Date
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Expiry Date
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Uploaded Doc
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.docName}</TableCell> {/* ✅ Corrected */}
                  <TableCell>{entry.docNumber}</TableCell> {/* ✅ Corrected */}
                  <TableCell>{entry.issueDate}</TableCell>{" "}
                  {/* ✅ Extracted Date */}
                  <TableCell>{entry.expiryDate}</TableCell>{" "}
                  {/* ✅ Extracted Date */}
                  <TableCell>
                    {entry.filePath ? (
                      <Button
                        sx={{ color: "white" }}
                        variant="contained"
                        color="blue"
                        size="small"
                        href={entry.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </Button>
                    ) : (
                      "No File"
                    )}
                  </TableCell>
                  <TableCell>
                    {/* ✏️ Edit Button */}
                    <Tooltip title="Edit">
                      <IconButton
                        color="blue"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 📌 No documents found */}
      {!loading && !error && entries.length === 0 && (
        <div className="w-full py-8 flex items-center justify-center">
          <Typography>No documents found.</Typography>
        </div>
      )}
    </div>
  );
}
