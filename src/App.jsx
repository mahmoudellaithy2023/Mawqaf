import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./Routes/Routes";
import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import IntroAnimation from "./IntroAnimation";

function MainContent({ router }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const introShown = localStorage.getItem("introShown");
    if (isAuthenticated || !introShown) {
      setShowIntro(true);
    } else if (!isAuthenticated || introShown) {
      setShowIntro(false);
    }
  }, [isAuthenticated]);

  const handleIntroComplete = () => {
    localStorage.setItem("introShown", "true");
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MainContent router={routes} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
