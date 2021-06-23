//Packages
import { BrowserRouter, Route, Switch } from "react-router-dom";

//Context
import { AuthContextProvider } from "./contexts/AuthContext";

//Pages
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          {/* Define que a rota /rooms/'qualquercoisa' chama a página Room */}
          <Route path="/rooms/:id" component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
