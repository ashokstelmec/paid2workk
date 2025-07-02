import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Icons
import { FiPaperclip } from "react-icons/fi";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "list",
  "ordered",
  "bullet",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
];

const JobDescription = ({ handleFileChange }) => {
  const [description, setDescription] = useState("");
  const [charCount, setCharCount] = useState(5000);
  const [fileName, setFileName] = useState("");

  const maxLength = 5000;

  useEffect(() => {
    const savedDescription = sessionStorage.getItem("projectDescription");
    const savedFileName = sessionStorage.getItem("projectFileName");

    if (savedDescription) {
      setDescription(savedDescription);
      setCharCount(maxLength - savedDescription.length);
    }

    if (savedFileName) {
      setFileName(savedFileName);
    }
  }, []);

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setCharCount(maxLength - value.length);
    sessionStorage.setItem("projectDescription", value);
  };

  return (
    <div className="flex items-center justify-center pt-0 md:pt-5">
      <div className="mb-32 w-full flex items-center justify-center gap-10">
        <form
          id="job-post-form"
          className="w-full flex items-center justify-center"
        >
          <div className="w-full justify-center flex flex-col md:flex-row px-5 md:px-0">
            <div className="w-full md:w-1/2 xl:w-[45svw]  md:items-center flex flex-col gap-3 md:px-4 md:pr-20 2xl:pr-0">
              <div className="w-fit md:pl-12 2xl:pl-0">
                <h2 className="text-xl font-medium mb-4">
                  Start the conversation
                </h2>
                <div className="bullet-points mb-8">
                  <p className="font-medium text-black mb-3">
                    Talents are looking for:
                  </p>
                  <ul className="description-lists list-disc pl-6 space-y-1 text-black/80 text-sm">
                    <li>Clear expectations about your task or deliverables</li>
                    <li>The skills required for your work</li>
                    <li>Good communication</li>
                    <li>Details about how you or your team like to work</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 md:px-6">
              <p className="text-xl font-medium text-black mb-2">
                Describe what you need
              </p>

              <div className="w-full h-[23rem] bg-white">
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={handleDescriptionChange}
                  formats={formats}
                  maxLength={maxLength}
                  className="h-80 bg-white"
                  placeholder="Already have a description? Paste it here!"
                />
              </div>

              <div className="w-full pt-0.5 xl:pt-0 xl:w-full">
                <p
                  className={`${
                    charCount >= 0
                      ? "text-muted-foreground text-sm"
                      : "text-red"
                  } text-end `}
                  id="charCount"
                >
                  {charCount.toLocaleString()} characters left
                </p>

                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center gap-1 w-fit bg-white border-2 border-blue text-blue rounded-full cursor-pointer px-3 py-1 transition duration-300 ease-in-out hover:bg-blue hover:text-white"
                >
                  <FiPaperclip /> Attach File
                </label>
                <input
                  type="file"
                  id="file-input"
                  className="file-input hidden"
                  accept=".pdf, image/*"
                  onChange={handleFileChange}
                />
                <p id="fileName" className="file-name mt-2 text-black/75">
                  {fileName}
                </p>
                <p className="text-black/50 mt-1 text-sm">
                  Max file size: 100 MB
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobDescription;
