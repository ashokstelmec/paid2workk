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

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user?.nUserID) return;

      try {
        const response = await fetch(
          `https://paid2workk.solarvision-cairo.com/GetUserPersonalDetails?NUserId=${sessionStorage.getItem("NUserID")}`
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
      if (!formData.currentPassword)
        tempErrors.currentPassword = "Current password is required.";
      if (!formData.newPassword || formData.newPassword.length < 8)
        tempErrors.newPassword = "New password must be at least 8 characters.";
      if (formData.newPassword !== formData.retypePassword)
        tempErrors.retypePassword = "Passwords do not match.";
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

  // 🔹 Handle form submission
  const handleSubmit = async (type) => {
    if (!validateForm(type)) {
      console.log(`Validation failed for ${type}`);
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
        console.log(`Account deactivation request submitted:`, formData);
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
 
    console.log("Email change request submitted:", emailChangeReason);
    setEmailModalOpen(false);
    setEmailChangeReason(""); // Clear input after submission
  };

  return (
    <>
      <div className="space-y-6 px-5 pb-5">
        {/* Password Change */}
        <div className="flex flex-col md:flex-row items-start pt-10 px-3 md:px-10">
          <div className="relative flex flex-col items-start justify-center group w-full md:w-7/12 mb-5 lg:pr-20">
            <Typography variant="h6" className="text-black/80 font-semibold">
              Change Password
            </Typography>
            <Typography variant="body2" className="text-black/60">
              Use a strong, unique password with a mix of characters. Regularly
              update it and consider enabling two-factor authentication for
              extra security.
            </Typography>
            {/* Tips Section */}
            <Box className="bg-gold/10 p-4 rounded-lg mt-5">
              <Typography variant="body2" className="text-gold">
                <span className="font-semibold">Pro tip:</span> Follow these
                guidelines for creating a strong password:
                <ul className="list-disc pl-6">
                  <li>Use at least 12 characters.</li>
                  <li>Include a mix of uppercase and lowercase letters.</li>
                  <li>
                    Incorporate numbers and special characters (!, @, #, etc.).
                  </li>
                </ul>
              </Typography>
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
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
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
                error={!!errors.newPassword}
                helperText={errors.newPassword}
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
                }}
              />
            </div>

            {/* Update Password Button */}
            <div className="flex justify-end" style={{ marginTop: "2rem" }}>
              <button
                className="bg-blue hover:brightness-125 rounded-md text-white font-medium px-6 py-2 hover:shadow-md shadow duration-300"
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
            <Typography variant="h6" className="text-black/80 font-semibold">
              Change Email
            </Typography>
            <Typography variant="body2" className="text-black/60">
              Change your email only for valid reasons. Ensure it's secure and
              regularly accessible for account notifications and recovery.
            </Typography>
          </div>
          <div className="md:pl-5 flex flex-col gap-3 w-full md:w-5/12">
            <div className=" gap-4 items-center">
              <TextField
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
                className="bg-blue hover:brightness-125 rounded-md text-white font-medium px-6 py-2 hover:shadow-md shadow duration-300"
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
            <Typography variant="h6" className="text-black/80 font-semibold">
              Deactivate Account
            </Typography>
            <Typography variant="body2" className="text-black/60">
              Deactivate your account only if necessary. You can reactivate it
              anytime by logging back in. Remember, deactivation is permanent
              until you sign in again.
            </Typography>
            {/* Tips Section */}
            <Box className="bg-red/10 p-4 rounded-lg mt-5">
              <Typography variant="body2" className="text-red">
                <span className="font-semibold">Note:</span>
                <ul className="list-disc pl-6">
                  <li> Deactivate your account only if necessary.</li>
                  <li>
                    Remember, deactivation is permanent until you sign in again.
                  </li>
                  <li>You can reactivate it anytime by logging back in.</li>
                </ul>
              </Typography>
            </Box>
          </div>
          <div className="md:pl-5 flex flex-col gap-3 w-full md:w-5/12">
            <FormControl variant="outlined" error={!!errors.deactivateReason}>
              <InputLabel disabled>Why do you want to leave?</InputLabel>
              <Select
                name="deactivateReason"
                value={formData.deactivateReason}
                onChange={handleChange}
                label="Why do you want to leave?"
                disabled
              >
                <MenuItem value="">Select a reason</MenuItem>
                <MenuItem value="privacy">Privacy Concerns</MenuItem>
                <MenuItem value="not-useful">Not Useful</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <Typography variant="caption" color="error">
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
              rows={5}
              disabled
              required
              error={!!errors.description}
              helperText={errors.description}
            />

            <div className="flex justify-end" style={{ marginTop: "2rem" }}>
              {/* Uncomment in Future */}
              {/* <button
              
                className="bg-red hover:brightness-125 text-white font-medium shadow hover:shadow-md px-6 py-2 duration-300 rounded-md"
                onClick={() => handleSubmit("deactivateAccount")}
              >
                {loading ? <CircularProgress size={24} /> : "Deactivate Now"}
              </button> */}

              {/* Disabled */}
              <button
              
                className="bg-grey text-black/40 font-medium px-6 py-2 duration-300 rounded-md cursor-not-allowed"
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
            onChange={(e) =>  setNewEmail(e.target.value)}
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
