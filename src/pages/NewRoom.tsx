//Packages
import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { database } from "../services/firebase";

//Hooks
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

//Images
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo-askr.svg";
import darkLogoImg from "../assets/images/dark-logo-askr.svg";

//Styles
import "../styles/auth.scss";

//Components
import { Button } from "../components/Button";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const { theme } = useTheme();

  const [newRoom, setNewRoom] = useState("");

  //Adiciona a tipagem FormEvent ao event,
  //que traz todas as propriedades de um event form
  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    //Se o valor do input for vazio para a função por aqui
    //trim() -> Remove os espaços tanto a direita quanto a esquerda do valor do input
    if (newRoom.trim() === "") {
      return;
    }

    //Define que no banco de dados será criada uma referência (categoria)
    //rooms para incluir os dados das salas. Exemplo: nome da sala, lista de perguntas, etc
    //OBS: O tipo de informação que será salvo pode ser qualquer um (array, objeto, boolean, string...)
    const roomRef = database.ref("rooms");

    //Envia os dados da sala para a referência do 'rooms' do banco de dados
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    //Redireciona o usuário para a sala criada passando o id da sala criada como complemento da rota
    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de perguntas e respostas ao-vivo.</strong>
        <p>
          Interaja com a sua audiência, ou una-se a uma sala já existente para
          fazer suas perguntas!
        </p>
      </aside>

      <main>
        <div className="main-content">
          <img src={theme === "light" ? logoImg : darkLogoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={(event) => handleCreateRoom(event)}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
            />
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
