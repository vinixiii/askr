//Packages
import { BrowserRouter, Route } from "react-router-dom";

//Context
import { AuthContextProvider } from "./contexts/AuthContext";

//Pages
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route exact path="/" component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
