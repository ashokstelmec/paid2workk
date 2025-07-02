const PROJECT_FORM_KEY = 'projectPostingProgress';

export const saveFormData = (step, data) => {
  try {
    const existingData = JSON.parse(sessionStorage.getItem(PROJECT_FORM_KEY) || '{}');
    const updatedData = {
      ...existingData,
      [step]: data
    };
    sessionStorage.setItem(PROJECT_FORM_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

export const getFormData = (step) => {
  try {
    const data = sessionStorage.getItem(PROJECT_FORM_KEY);
    return data ? JSON.parse(data)[step] || null : null;
  } catch (error) {
    console.error('Error getting form data:', error);
    return null;
  }
};

export const getAllFormData = () => {
  try {
    const data = sessionStorage.getItem(PROJECT_FORM_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting all form data:', error);
    return {};
  }
};

export const clearFormData = () => {
  sessionStorage.removeItem(PROJECT_FORM_KEY);
};
