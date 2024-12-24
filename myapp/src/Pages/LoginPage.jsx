// import React, { useState } from "react";
// import logo from "../assets/logo.png";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Login Details:", { email, password });
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
//         {/* Logo and Header */}
//         <div className="flex items-center justify-center mb-6">
//           <img src={logo} alt="Logo" className="h-12 w-12 mr-3" />
//           <h1 className="text-3xl font-bold text-gray-800">Cohere</h1>
//         </div>

//         <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Login</h2>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { token } = response.data;

      // Store the JWT token in localStorage for user session management
      localStorage.setItem("authToken", token);
      setSuccess(true);
      console.log("Login successful, token:", token);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        {/* Logo and Header */}
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="h-12 w-12 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Cohere</h1>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Login</h2>

        {/* Success Message */}
        {success && (
          <p className="mb-4 text-green-600 text-center">
            Login successful! Redirecting...
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mb-4 text-red-600 text-center">{error}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

