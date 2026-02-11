// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return (
//     <BrowserRouter>
//     <AppRoutes/>
//     </BrowserRouter>
//   );
// }

// export default App;
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


import { useEffect } from 'react';
import AppRoutes from "./routes/AppRoutes";
import { setupForegroundListener } from './services/fcmService';

export default function App() {
  useEffect(() => {
    // Setup foreground notification listener
    if ('serviceWorker' in navigator) {
      setupForegroundListener();
      console.log('✅ FCM foreground listener setup');
      
      // Listen for token requests from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'GET_AUTH_TOKEN') {
          const token = localStorage.getItem('token');
          event.ports[0].postMessage({ token });
        }
      });
    }
  }, []);

  return <AppRoutes />;
}
