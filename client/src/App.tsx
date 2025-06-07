import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameEngine from "./components/game/GameEngine";
import SoundManager from "./components/game/SoundManager";
import "@fontsource/inter";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

function App() {
  useEffect(() => {
    // Prevent right-click context menu on the game
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-yellow-900 via-amber-800 to-orange-700">
        <GameEngine />
        <SoundManager />
      </div>
    </QueryClientProvider>
  );
}

export default App;
