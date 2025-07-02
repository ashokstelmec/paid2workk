import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  FormHelperText,
  styled,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useAuth } from "../../contexts/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const documentTypes = [
  "Passport",
  "National ID",
  "Driver's License",
  "Work Permit",
  "Visa",
  "Other",
];

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const DocumentFormModal = ({ open, onClose, onSubmit, initialData = null }) => {
  const { user } = useAuth();

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    // Handle both date formats (with or without time)
    const date = dateString.includes("T")
      ? dateString.split("T")[0]
      : dateString.replace(/(\d{4})-(\d{2})-(\d{2}).*/, "$1-$2-$3");
    return date;
  };

  const [formData, setFormData] = useState({
    documentType: "",
    otherDocumentType: "",
    docNumber: "",
    issueDate: "",
    expiryDate: "",
    documentFile: null,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      if (initialData) {
        // console.log("Initial data received:", initialData);

        // Check if the document type is in our predefined list
        const isStandardType = documentTypes.includes(initialData.docName);

        setFormData({
          documentType: isStandardType ? initialData.docName : "Other",
          otherDocumentType: isStandardType ? "" : initialData.docName,
          docNumber: initialData.docNumber || "",
          issueDate: formatDate(initialData.issueDate),
          expiryDate: formatDate(initialData.expiryDate),
          documentFile: null,
          existingFilePath: initialData.filePath,
        });

        // console.log("Formatted dates:", {
        //   issueDate: formatDate(initialData.issueDate),
        //   expiryDate: formatDate(initialData.expiryDate),
        // });
      } else {
        resetForm();
      }
    };

    loadInitialData();
  }, [initialData, open]);

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    // console.log(`Updating ${field}:`, value); // Debug log
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      setFormData({ ...formData, documentFile: event.target.files[0] });
    }
  };

  const resetForm = () => {
    setFormData({
      documentType: "",
      otherDocumentType: "", // If "Other" is selected, this field will store the value
      docNumber: "",
      issueDate: "",
      expiryDate: "",
      documentFile: null,
      errors: {},
    });
  };

  const validateForm = () => {
    let newErrors = {};

    // Document Type Validation
    if (!formData.documentType) {
      newErrors.documentType = "Document Type is required.";
    }
    if (
      formData.documentType === "Other" &&
      !formData.otherDocumentType.trim()
    ) {
      newErrors.otherDocumentType = "Please specify the document type.";
    }

    // Document Number Validation
    if (!formData.docNumber.trim()) {
      newErrors.docNumber = "Document Number is required.";
    }

    // Issue Date Validation
    if (!formData.issueDate) {
      newErrors.issueDate = "Issue Date is required.";
    }

    // Expiry Date Validation
    // if (!formData.expiryDate) {
    //   newErrors.expiryDate = "Expiry Date is required.";
    // } else if (
    //   formData.issueDate &&
    //   formData.expiryDate &&
    //   formData.issueDate > formData.expiryDate
    // ) {
    //   newErrors.expiryDate = "Expiry Date must be after Issue Date!";
    // }

    // File Upload Validation
    if (!formData.documentFile && !formData.existingFilePath) {
      newErrors.documentFile = "Please upload a document";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns false if errors exist
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      setIsSaving(true);
      const formPayload = new FormData();

      // Format dates for submission
      const submitData = {
        ...formData,
        issueDate: formatDate(formData.issueDate),
        expiryDate: formatDate(formData.expiryDate),
      };

      // Always include NUserId for both create and update
      const userId = user?.nUserID?.toString();
      if (!userId) {
        throw new Error("User ID is missing. Please log in again.");
      }
      formPayload.append("NUserId", userId);

      // For update, add docId to URL and payload
      if (initialData?.id) {
        formPayload.append("DocId", initialData.id.toString());
      }

      // Modified to handle Other document type
      const finalDocumentType =
        formData.documentType === "Other"
          ? formData.otherDocumentType
          : formData.documentType;

      formPayload.append("DocName", finalDocumentType);
      formPayload.append("DocNumber", submitData.docNumber);
      formPayload.append("IssueDate", submitData.issueDate);
      formPayload.append("ExpiryDate", submitData.expiryDate);

      // Handle file upload considering existing file
      if (formData.documentFile) {
        formPayload.append("NFile", formData.documentFile);
      } else if (formData.existingFilePath && initialData?.id) {
        // If we're editing and using existing file, send the file path
        formPayload.append("ExistingFilePath", formData.existingFilePath);
      }

      const url = initialData?.id
        ? `https://paid2workk.solarvision-cairo.com/UpdateDocument?docId=${initialData.id}&nUserId=${userId}`
        : "https://paid2workk.solarvision-cairo.com/InsertDocument";

      // console.log("Sending request to:", url, formPayload); // Debug log

      const response = await fetch(url, {
        method: initialData?.id ? "PUT" : "POST",
        body: formPayload,
      });

      const responseText = await response.text();
      // console.log("Server response:", responseText);

      if (responseText.includes("successfully")) {
        toast.success(
          initialData?.id
            ? "Document updated successfully!"
            : "Document saved successfully!"
        );
        onSubmit(formData, initialData?.id); // Pass the ID back if it was an update
        resetForm();
        onClose();
      } else {
        throw new Error(
          initialData?.id
            ? "Failed to update document"
            : "Failed to save document"
        );
      }
    } catch (error) {
      console.error("❌ Operation error:", error);
      toast.error(`Failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "#f8f9fa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e9ecef",
        }}
      >
        <h6 className="font-medium">
          {initialData ? "Edit Document" : "Add New Document"}
        </h6>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <Box component="form" sx={{ "& .MuiTextField-root": { my: 1.5 } }}>
          {/* Document Type Dropdown */}
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ my: 1.5 }}
            error={!!errors.documentType}
          >
            <InputLabel
              sx={{
                fontSize: "0.875rem",
                padding: "0px",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
                "&:not(.MuiInputLabel-shrink)": {
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                },
              }}
            >
              Document Type
            </InputLabel>
            <Select
              sx={{
                height: "43px",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  padding: "0 14px",
                  minHeight: "43px !important",
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "20rem",
                  },
                },
              }}
              value={formData.documentType}
              onChange={handleChange("documentType")}
              label="Document Type"
            >
              <MenuItem value="Passport">Passport</MenuItem>
              {/* <MenuItem value="ID Card">ID Card</MenuItem> */}
              <MenuItem value="Driving License">Driving License</MenuItem>
              <MenuItem value="Pan Card">PAN CARD</MenuItem>
              <MenuItem value="Aadhar Card">AADHAR CARD</MenuItem>
              <MenuItem value="Voter Id">VOTER ID </MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors.documentType && (
              <FormHelperText>{errors.documentType}</FormHelperText>
            )}
          </FormControl>

          {/* Other Document Type Input (shown only if "Other" is selected) */}
          {formData.documentType === "Other" && (
            <TextField
              InputProps={{
                sx: {
                  height: "43px",
                  "& .MuiInputBase-input": {
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.875rem",
                    padding: "0 14px",
                    "&::placeholder": {
                      fontSize: "0.75rem",
                      opacity: 0.7,
                    },
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "0.875rem",
                  transform: "translate(14px, 13px)",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
              fullWidth
              label="Specify Other Document Type"
              value={formData.otherDocumentType}
              onChange={handleChange("otherDocumentType")}
              error={!!errors.otherDocumentType}
              helperText={errors.otherDocumentType}
              variant="outlined"
              sx={{ my: 1.5 }}
            />
          )}

          {/* Document Number */}
          <TextField
            InputProps={{
              sx: {
                height: "43px",
                "& .MuiInputBase-input": {
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  padding: "0 14px",
                  "&::placeholder": {
                    fontSize: "0.75rem",
                    opacity: 0.7,
                  },
                },
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "0.875rem",
                transform: "translate(14px, 13px)",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              },
            }}
            fullWidth
            label="Document Number"
            value={formData.docNumber}
            onChange={handleChange("docNumber")}
            error={!!errors.docNumber}
            helperText={errors.docNumber}
            variant="outlined"
            sx={{ my: 1.5 }}
          />

          <div className="flex gap-5">
            {/* Issue Date */}
            <TextField
              InputProps={{
                sx: {
                  height: "43px",
                  "& .MuiInputBase-input": {
                    height: "100%",

                    alignItems: "center",
                    fontSize: "0.875rem",
                    padding: "0 14px",
                    "&::placeholder": {
                      fontSize: "0.75rem",
                      opacity: 0.7,
                    },
                  },
                },
              }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: "0.875rem",
                  transform: "translate(14px, 13px)",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
              fullWidth
              label="Issue Date"
              type="date"
              value={formData.issueDate || ""}
              onChange={handleChange("issueDate")}
              error={!!errors.issueDate}
              helperText={errors.issueDate}
              variant="outlined"
              sx={{ my: 1.5 }}
            />

            {/* Expiry Date */}
            <TextField
              InputProps={{
                sx: {
                  height: "43px",
                  "& .MuiInputBase-input": {
                    height: "100%",
                    alignItems: "center",
                    fontSize: "0.875rem",
                    padding: "0 14px",
                    "&::placeholder": {
                      fontSize: "0.75rem",
                      opacity: 0.7,
                    },
                  },
                },
              }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: "0.875rem",
                  transform: "translate(14px, 13px)",
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -9px) scale(0.75)",
                  },
                },
              }}
              fullWidth
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange("expiryDate")}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              variant="outlined"
              sx={{ my: 1.5 }}
            />
          </div>

          {/* File Upload */}
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <Button
              size="small"
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              sx={{ mr: 2 }}
            >
              {formData.documentFile || formData.existingFilePath
                ? "Change File"
                : "Upload File"}
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
            {(formData.documentFile || formData.existingFilePath) && (
              <Typography variant="body2" color="textSecondary">
                {formData.documentFile?.name ||
                  formData.existingFilePath.split("/").pop()}
              </Typography>
            )}
          </Box>
          {errors.documentFile && (
            <Typography color="error">{errors.documentFile}</Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, background: "#f8f9fa" }}>
        <Button
          size="small"
          sx={{ color: "white" }}
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          size="small"
          sx={{ color: "white" }}
          onClick={handleSubmit}
          variant="contained"
          color="blue"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Document"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentFormModal;
