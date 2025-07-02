// export const useGoogleLogin = () => {
//   // Get stored token function
//   const getStoredToken = () => sessionStorage.getItem("googleToken");
  
//   // Initialize Google client function
//   const initGoogleClient = () => {
//     return window.google.accounts.oauth2.initTokenClient({
//       client_id: "1045743784003-et3te6mlfuc14p466up4rn83qsrisob2.apps.googleusercontent.com",
//       scope: "email profile",
//       callback: null // We'll set this in the promise
//     });
//   };

//   // Main login function
//   const googleLogin = async () => {
//     return new Promise((resolve, reject) => {
//       if (!window.google || !window.google.accounts) {
//         return reject("Google API not loaded.");
//       }

//       // Check for stored token first
//       const storedToken = getStoredToken();
//       if (storedToken) {
//         return resolve({ access_token: storedToken });
//       }

//       // Initialize client
//       const client = initGoogleClient();
      
//       // Set callback
//       client.callback = (response) => {
//         if (response.error) {
//           reject(response.error);
//         } else {
//           sessionStorage.setItem("googleToken", response.access_token);
//           resolve(response);
//         }
//       };

//       client.requestAccessToken();
//     });
//   };

//   return { googleLogin };
// };
