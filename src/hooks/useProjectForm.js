import { useState } from 'react';

const useProjectForm = (initialStep) => {
  // Initialize with empty title
  const [formData, setFormData] = useState({ title: '', masterCategory: ''});

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const clearCurrentStep = (step) => {
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[step];
      return newData;
    });
  };

  const clearAllSteps = () => {
    setFormData({});
  };

  const getStepData = (step) => {
    return formData[step] || {};
  };

  return {
    formData,
    updateFormData,
    clearCurrentStep,
    clearAllSteps,
    getStepData
  };
};

export default useProjectForm;