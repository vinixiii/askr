//Packages
import { Link } from "react-router-dom";

//Images
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

//Styles
import "../styles/auth.scss";

//Components
import { Button } from "../components/Button";
import { useContext } from "react";
import { AuthContext } from "../App";

export function NewRoom() {
  const { user } = useContext(AuthContext);

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo real</p>
      </aside>

      <h1>{user?.name}</h1>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form>
            <input type="text" placeholder="Nome da sala" />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
