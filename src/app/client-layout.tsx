// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function ClientLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [token, setToken] = useState<string | null>(null);
//   console.log(token);
//   // Function to get session state
//   const getSessionState = async () => {
//     return axios.get("/api/check-session");
//   };

//   // Check session state on component mount
//   useEffect(() => {
//     getSessionState().then((res) => {
//       if (res.data.sessionData && res.data.sessionData.api_token) {
//         axios.get("/api/currency").then(() => {
//           setToken(res.data.sessionData.api_token);
//         });
//       } else {
//         setToken(null);
//       }
//     });
//   }, []);

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  withCredentials: true,
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);

  // Function to get session state
  const getSessionState = async () => {
    return api.get("/api/check-session");
  };

  // Check session state on component mount
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        console.log("Fetching session data...");
        const res = await getSessionState();
        console.log("Session data response:", res.data);

        const { sessionData } = res.data;
        if (sessionData && sessionData.api_token) {
          setToken(sessionData.api_token);
          console.log("Token set successfully:", sessionData.api_token);

          // Make a test request to /api/currency
          try {
            const currencyRes = await api.get("/api/currency");
            console.log(
              "Successfully made request to /api/currency:",
              currencyRes.data
            );
          } catch (error) {
            console.error("Error making request to /api/currency:", error);
          }
        } else {
          console.log("No valid session data received");
          setToken(null);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
        setToken(null);
      }
    };

    fetchSessionData();
  }, []);

  // You can add another useEffect here to perform actions when the token changes
  useEffect(() => {
    if (token) {
      console.log(
        "Token is set. You can perform actions that require authentication here."
      );
    } else {
      console.log("No token available. User might need to log in.");
    }
  }, [token]);

  return <>{children}</>;
}
