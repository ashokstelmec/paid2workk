import { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Button,
  Modal,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../../contexts/authContext";
import { RxCross2 } from "react-icons/rx";
import { Bounce, toast } from "react-toastify";

const Security = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    retypePassword: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    retypePassword: "",
    deactivateReason: "",
    description: "",
    email: "",
  });

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailChangeReason, setEmailChangeReason] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user?.nUserID) return;

      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?NUserId=${sessionStorage.getItem(
            "NUserID"
          )}`
        );
        const userData = await response.json();
        const userEmail = userData[0].email;
        setFormData({ email: userEmail });
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchInitialData();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "newPassword") {
      validatePassword(value);
    }

    // Remove validation error once user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // 🔹 Toggle Password Visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // 🔹 Validation function
  const validateForm = (type) => {
    let tempErrors = {};

    if (type === "updatePassword") {
      if (!formData.currentPassword) {
        tempErrors.currentPassword = "Current password is required.";
      }
      if (!formData.newPassword) {
        tempErrors.newPassword = "New password is required.";
      } else if (!isPasswordValid) {
        tempErrors.newPassword = passwordError;
      }
      if (formData.newPassword !== formData.retypePassword) {
        tempErrors.retypePassword = "Passwords do not match.";
      }
    }

    if (type === "deactivateAccount") {
      if (!formData.deactivateReason)
        tempErrors.deactivateReason = "Please select a reason.";
      if (formData.description.length < 10)
        tempErrors.description = "Description must be at least 10 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

    if (!passwordRegex.test(password)) {
      if (!password) {
        setPasswordError(""); // No error if empty
      } else if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
      } else if (!/[A-Z]/.test(password)) {
        setPasswordError(
          "Password must contain at least one uppercase letter."
        );
      } else if (!/[a-z]/.test(password)) {
        setPasswordError(
          "Password must contain at least one lowercase letter."
        );
      } else if (!/\d/.test(password)) {
        setPasswordError("Password must contain at least one number.");
      } else if (!/\W/.test(password)) {
        setPasswordError(
          "Password must contain at least one special character."
        );
      } else {
        setPasswordError("Set a strong password."); // fallback (if needed)
      }
      setIsPasswordValid(false);
    } else {
      setPasswordError("");
      setIsPasswordValid(true);
    }
  };

  // 🔹 Handle form submission
  const handleSubmit = async (type) => {
    if (!validateForm(type)) {
      // console.log(`Validation failed for ${type}`);
      return;
    }

    // 🔹 Prevent using the same old and new password
    if (
      type === "updatePassword" &&
      formData.currentPassword === formData.newPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password cannot be the same as the old password.",
      }));
      return;
    }

    setLoading(true);

    try {
      if (type === "updatePassword") {
        const userID = sessionStorage.getItem("NUserID"); // Get NUserID dynamically

        if (!userID) {
          throw new Error("User ID not found. Please log in again.");
        }

        const apiURL = `https://paid2workk.solarvision-cairo.com/ChangePasswordWithoutToken?NUserID=${userID}&oldPassword=${encodeURIComponent(
          formData.currentPassword
        )}&newPassword=${encodeURIComponent(formData.newPassword)}`;

        const response = await fetch(apiURL, { method: "POST" });

        const textResponse = await response.text(); // Read response as text

        if (!response.ok) {
          throw new Error(`Server Error: ${textResponse}`);
        }
        toast.success("Password updated Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        // 🔹 Reset the password fields after successful update
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          retypePassword: "",
        }));
      }

      if (type === "deactivateAccount") {
        // console.log(`Account deactivation request submitted:`, formData);
      }
    } catch (error) {
      toast.error(`Current Password is Incorrect!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle email change modal submission
  const handleEmailChangeRequest = () => {
    if (!emailChangeReason) {
      setErrors({ emailChangeReason: "Reason is required." });
      return;
    }
    if (!modalPassword) {
      setErrors({ modalPassword: "Password is required." });
      return;
    }
    if (!newEmail) {
      setErrors({ newEmail: "New Emaill address is required." });
      return;
    }

    // console.log("Email change request submitted:", emailChangeReason);
    setEmailModalOpen(false);
    setEmailChangeReason(""); // Clear input after submission
  };

  return (
    <>
      <div className="space-y-6 px-5 pb-5">
        {/* Password Change */}
        <div className="flex flex-col md:flex-row items-start pt-10 px-3 md:px-10">
          <div className="relative flex flex-col items-start justify-center group w-full md:w-7/12 mb-5 lg:pr-20">
            <h6 className="text-black font-medium ">Change Password</h6>
            <span className="text-muted-foreground text-sm">
              Use a strong, unique password with a mix of characters. Regularly
              update it and consider enabling two-factor authentication for
              extra security.
            </span>
            {/* Tips Section */}
            <Box className="bg-gold/10 p-4 rounded-lg mt-5">
              <span className="text-gold text-xs">
                <span className="font-medium">Pro tip:</span> Follow these
                guidelines for creating a strong password:
                <ul className="list-disc pl-6">
                  <li>Use at least 12 characters.</li>
                  <li>Include a mix of uppercase and lowercase letters.</li>
                  <li>
                    Incorporate numbers and special characters (!, @, #, etc.).
                  </li>
                </ul>
              </span>
            </Box>
          </div>
          <div className="md:pl-5 flex flex-col gap-3 w-full md:w-5/12">
            {/* Password Fields in Two Columns */}
            <div className="grid grid-cols-1 gap-4 items-center">
              {/* Old Password */}
              <TextField
                label="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                sx={{ width: "100%" }}
                variant="outlined"
                type={showPassword.currentPassword ? "text" : "password"}
                required
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          togglePasswordVisibility("currentPassword")
                        }
                      >
                        {showPassword.currentPassword ? (
                          <VisibilityOff className="w-3 h-3" />
                        ) : (
                          <Visibility className="w-3 h-3" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    minHeight: "43px",
                    "& .MuiInputBase-input": {
                      minHeight: "43px",
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
              />

              {/* New Password */}
              <TextField
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                sx={{ width: "100%" }}
                variant="outlined"
                type={showPassword.newPassword ? "text" : "password"}
                required
                error={!!errors.newPassword || !!passwordError}
                helperText={errors.newPassword || passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("newPassword")}
                      >
                        {showPassword.newPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    minHeight: "43px",
                    "& .MuiInputBase-input": {
                      minHeight: "43px",
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
              />

              {/* Retype Password */}
              <TextField
                label="Confirm New Password"
                name="retypePassword"
                value={formData.retypePassword}
                onChange={handleChange}
                sx={{ width: "100%" }}
                variant="outlined"
                type={showPassword.retypePassword ? "text" : "password"}
                required
                error={!!errors.retypePassword}
                helperText={errors.retypePassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          togglePasswordVisibility("retypePassword")
                        }
                      >
                        {showPassword.retypePassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    minHeight: "43px",
                    "& .MuiInputBase-input": {
                      minHeight: "43px",
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
              />
            </div>

            {/* Update Password Button */}
            <div className="flex justify-end mt-2">
              <button
                className="bg-blue hover:brightness-125 rounded-md text-white text-sm px-4 py-1.5 hover:shadow-md shadow duration-300"
                onClick={() => handleSubmit("updatePassword")}
              >
                {loading ? (
                  <CircularProgress color="blue.main" size={18} />
                ) : (
                  "Update Now"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Email Change */}
        <div className="flex flex-col md:flex-row items-start pt-10 px-3 md:px-10">
          <div className="relative flex flex-col items-start justify-center group w-full md:w-7/12 mb-5 lg:pr-20">
            <h6 className="text-black font-medium">Change Email</h6>
            <span className="text-muted-foreground text-sm">
              Change your email only for valid reasons. Ensure it's secure and
              regularly accessible for account notifications and recovery.
            </span>
          </div>
          <div className="md:pl-5 flex flex-col gap-3 w-full md:w-5/12">
            <div className=" gap-4 items-center">
              <TextField
                InputProps={{
                  sx: {
                    minHeight: "43px",
                    "& .MuiInputBase-input": {
                      minHeight: "43px",
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
                label="Current Email"
                name="email"
                value={formData.email}
                sx={{ width: "100%" }}
                variant="outlined"
                disabled // 🔹 Read-only email field
              />
            </div>

            {/* Request Change Email Button */}
            <div className="flex justify-end">
              <button
                className="bg-blue hover:brightness-125 rounded-md text-white text-sm px-4 py-1.5 hover:shadow-md shadow duration-300"
                onClick={() => setEmailModalOpen(true)}
              >
                Request to Change Email
              </button>
            </div>
          </div>
        </div>

        {/* Deactivate Account */}
        <div className="flex flex-col md:flex-row items-start pt-10 px-3 md:px-10">
          <div className="relative flex flex-col items-start justify-center group w-full md:w-7/12 mb-5 lg:pr-20">
            <h6 className="text-black font-medium">Deactivate Account</h6>
            <span className="text-muted-foreground text-sm">
              Deactivate your account only if necessary. You can reactivate it
              anytime by logging back in. Remember, deactivation is permanent
              until you sign in again.
            </span>
            {/* Tips Section */}
                  <Box className="bg-red/10 p-4 rounded-lg mt-5 ">
                    <span className="text-red text-xs">
                    <span className="font-medium">Note:</span>
                    <ul className="list-disc pl-6">
                      <li> Deactivate your account only if necessary.</li>
                      <li>
                      Remember, deactivation is permanent until you sign in again.
                      </li>
                      <li>You can reactivate it anytime by logging back in.</li>
                    </ul>
                    </span>
                  </Box>
                  </div>
                  <div className="md:pl-5 flex flex-col gap-3 w-full md:w-5/12 ">
                  <FormControl variant="outlined" error={!!errors.deactivateReason}>
                    <InputLabel
                    sx={{
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    disabled
                    >
                    Why do you want to leave?
                    </InputLabel>
                    <Select
                    sx={{
                      height: "43px",
                      fontSize: "0.875rem",
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
                        fontSize: "0.875rem",
                      },
                      },
                    }}
                    name="deactivateReason"
                    value={formData.deactivateReason}
                    onChange={handleChange}
                    label="Why do you want to leave?"
                    disabled
                    >
                    <MenuItem value="" sx={{ fontSize: "0.875rem" }}>Select a reason</MenuItem>
                    <MenuItem value="privacy" sx={{ fontSize: "0.875rem" }}>Privacy Concerns</MenuItem>
                    <MenuItem value="not-useful" sx={{ fontSize: "0.875rem" }}>Not Useful</MenuItem>
                    <MenuItem value="other" sx={{ fontSize: "0.875rem" }}>Other</MenuItem>
                    </Select>
                    <Typography variant="caption" color="error" sx={{ fontSize: "0.75rem" }}>
                    {errors.deactivateReason}
                    </Typography>
                  </FormControl>

                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    disabled
                    required
                    sx={{
                    fontSize: "0.875rem",
                    "& .MuiInputBase-input": {
                      fontSize: "0.875rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                    },
                    }}
                    error={!!errors.description}
                    helperText={errors.description}
                  />

                  <div className="flex justify-end mt-2">
                    {/* Uncomment in Future */}
              {/* <button
              
                className="bg-red hover:brightness-125 text-white font-medium shadow hover:shadow-md px-6 py-2 duration-300 rounded-md"
                onClick={() => handleSubmit("deactivateAccount")}
              >
                {loading ? <CircularProgress size={24} /> : "Deactivate Now"}
              </button> */}

              {/* Disabled */}
              <button
                className="bg-gray text-muted-foreground text-sm   px-4 py-1.5 duration-300 rounded-md cursor-not-allowed"
                // onClick={() => handleSubmit("deactivateAccount")}
              >
                {loading ? <CircularProgress size={24} /> : "Deactivate Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Email Change Request Modal */}
      <Modal open={emailModalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
            width: { xs: "90%", sm: "400px" },
            position: "relative",
          }}
        >
          <div className="flex w-full justify-between items-center mb-5">
            <Typography variant="h6">Request Email Change</Typography>
            <IconButton onClick={() => setEmailModalOpen(false)}>
              <RxCross2 className="h-6 w-6 text-red" />
            </IconButton>
          </div>
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Type a Reason
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Enter reason for changing email"
            value={emailChangeReason}
            onChange={(e) => setEmailChangeReason(e.target.value)}
            error={!!errors.emailChangeReason}
            helperText={errors.emailChangeReason}
            sx={{ marginBottom: "15px" }}
          />

          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Current Password
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Enter current password"
            value={modalPassword}
            onChange={(e) => setModalPassword(e.target.value)}
            error={!!errors.modalPassword}
            helperText={errors.modalPassword}
            sx={{ marginBottom: "15px" }}
          />

          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            New Email
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            type="email"
            placeholder="Enter New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            error={!!errors.newEmail}
            helperText={errors.newEmail}
          />

          {/* 🔹 Cancel & Submit Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-white hover:brightness-125 rounded-md text-red border border-red font-medium px-6 py-2 hover:shadow-md shadow duration-300"
              onClick={() => setEmailModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue hover:brightness-125 rounded-md text-white font-medium px-6 py-2 hover:shadow-md shadow duration-300"
              onClick={handleEmailChangeRequest}
            >
              Submit
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Security;
