import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
    <AppRoutes/>
    </BrowserRouter>
  );
}

export default App;
// import MedicineCabinet from "./pages/Dashboard/Cabinet";
// import AlertScreen from  "./pages/Dashboard/Alerts";
//  function App() {

// return (
// <MedicineCabinet />
//    );
//   }
//   export default App;
// //  return (
// // <MedicineCabinet />
// //    );
// // return <AlertScreen />


// import AppRoutes from "./routes/AppRoutes";

// export default function App() {
//   return <AppRoutes />;
// }


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)
// return(
//   <>
//        <div>
//             <p>Hello Project</p>
//        </div>
//   </>
// )
// }
// export default App;
