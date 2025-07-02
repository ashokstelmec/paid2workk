import React, { useState, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

const Skills = () => {
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const maxSkills = 15;

  useEffect(() => {
    fetchSkills();
    // Load saved skills from session storage
    const savedSkills = sessionStorage.getItem("projectSkills");
    if (savedSkills) {
      setSelectedSkills(savedSkills);
    }
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveSkills"
      );
      const data = await response.json();
      const skills = data.map((skill) => skill.skillName);
      setAllSkills(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  // const filterSkills = (e) => {
  //   const input = e.target.value.toLowerCase();
  //   setSkillInput(input);
  //   if (input) {
  //     const filtered = allSkills.filter((skill) =>
  //       skill.toLowerCase().includes(input)
  //     );
  //     setFilteredSkills(filtered);
  //   } else {
  //     setFilteredSkills([]);
  //   }
  // };

  const filterSkills = (e) => {
    let input = e.target.value;

    if (/[,\"']/.test(input)) {
      toast.error(
        "Invalid character entered: ',' , '\"' , or \"'\" are not allowed."
      );
      return; 
    }

    setSkillInput(input);

    if (input) {
      const filtered = allSkills.filter((skill) =>
        skill.toLowerCase().includes(input)
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };

  const addCustomSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const addSkill = (skillName) => {
    const skillsArray = selectedSkills.split(",").filter(Boolean);
    if (skillsArray.length >= maxSkills) {
      toast.error("Maximum of 15 skills allowed", {
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
      return;
    }

    // Clean up skill name
    const cleanSkill = skillName.trim();

    if (cleanSkill && !skillsArray.includes(cleanSkill)) {
      const newSkills = [...skillsArray, cleanSkill].join(",");
      setSelectedSkills(newSkills);
      // Save to session storage
      sessionStorage.setItem("projectSkills", newSkills);
      setSkillInput("");
      setFilteredSkills([]);
    }
  };

  const removeSkill = (skillName) => {
    const updatedSkills = selectedSkills
      .split(",")
      .filter((skill) => skill !== skillName)
      .join(",");
    setSelectedSkills(updatedSkills);
    // Update session storage
    sessionStorage.setItem("projectSkills", updatedSkills);
  };

  return (
    <>
      <div className="  flex items-center justify-center pt-0 md:pt-5 pb-24 xl:px-20 ">
        <div className="  h-full flex flex-col md:flex-row  justify-center  px-4 md:px-0 gap-2 md:gap-10">
          <div className="w-full px-0 md:px-4">
            <h2 className="text-black text-xl font-medium">
              What are the main skills required for your work?
            </h2>
          </div>

          <div className=" w-full px-0 md:px-4 ">
            <div className="search-bar mb-4">
              <label className="block mb-3 text-lg text-black font-medium">
                Search skills or add your own
              </label>

              <div className="relative">
                <input
                  type="text"
                  className="form-control w-full pl-4 pr-10 py-2 h-9 border bg-white border-gray rounded-md outline-none ring-1 ring-black/30 focus:ring-blue/80 duration-300"
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChange={filterSkills}
                  onKeyDown={addCustomSkill}
                />
                {filteredSkills.length > 0 && (
                  <div className="dropdownn-menu absolute z-10 bg-white border border-black rounded-md mt-2 w-full max-h-52 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="dropdown-item p-2 cursor-pointer hover:bg-gray"
                        onClick={() => addSkill(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                    {skillInput && !filteredSkills.includes(skillInput) && (
                      <div
                        className="dropdown-item custom-skill p-2 italic text-blue cursor-pointer hover:bg-gray"
                        onClick={() => addSkill(skillInput)}
                      >
                        Add "{skillInput}" as new skill
                      </div>
                    )}
                  </div>
                )}
              </div>
                
              {errorMessage && (
                <div
                  className="error-message text-red text-sm mt-2 p-2 rounded-md bg-red/10"
                  style={{ display: "block" }}
                >
                  {errorMessage}
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-[-5px]">
              For the best results, add 3-5 skills
            </p>
            <div className="selected-skills mt-4">
              {selectedSkills.length !== 0 &&
                selectedSkills.split(",").map((skill) => (
                  <span
                    key={skill}
                    className="badge inline-block bg-gray text-black/75 text-sm py-1.5 px-3 rounded-full mr-2 mb-2"
                  >
                    {skill}
                    <span
                      className="ms-2 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </span>
                  </span>
                ))}
            </div>
            <div className="popular-skills mt-0">
              <h5 className="text-lg font-medium text-black mb-4">
                Popular skills for Mobile App Development
              </h5>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    className="btn bg-white text-black border border-gray py-2 px-4 rounded-full text-sm hover:bg-blue/80 hover:text-white duration-300"
                    onClick={() => addSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skills;
