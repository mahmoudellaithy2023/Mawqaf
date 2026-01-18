// import React, { useState } from "react";
// import PhotoAuth from "../components/Auth/PhotoAuth";
// import LoginForm from "../components/Auth/LoginForm";
// import SignupForm from "../components/Auth/SignupForm";

// export default function Auth() {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <>
//       <section className="flex flex-row-reverse items-center justify-between min-h-screen bg-white">
//         {" "}
//         <PhotoAuth />
//         <div className=" absolute lg:relative flex justify-center items-center w-full lg:w-1/2 min-h-screen p-6 lg:p-12">
//           {/* Right Form */}
//           <div className="w-full max-w-md">
//             {isLogin ? (
//               <LoginForm switchForm={() => setIsLogin(false)} />
//             ) : (
//               <SignupForm switchForm={() => setIsLogin(true)} />
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import { Outlet } from "react-router-dom";
import PhotoAuth from "../components/Auth/PhotoAuth";
export default function AuthLayout() {
  return (
    <section className="flex flex-row-reverse items-center justify-between min-h-screen bg-white">
      <PhotoAuth />
      <div className="absolute lg:relative flex justify-center items-center w-full lg:w-1/2 min-h-screen p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet /> 
        </div>
      </div>
    </section>
  );
}
