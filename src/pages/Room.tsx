//Packages
import { FormEvent, useState } from "react";
import { useParams } from "react-router";

//Images
import logoImg from "../assets/images/logo.svg";

//Styles
import "../styles/room.scss";

//Components
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

//Types
type RoomParams = {
  id: string;
};

export function Room() {
  //Armazena os parâmetros da URL na const params
  const params = useParams<RoomParams>();
  //Armazena o params.id na const roomId
  const roomId = params.id;

  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("Você precisa estar logado!");
    }

    //Cria um objeto que armazena todas as informações de uma nova pergunta
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    };

    //Mandas as informações do objeto question para o banco de dados
    //passando a referência rooms e o roomId, ou seja, dentro do objeto roomId
    //da referência será criado um novo objeto question com essas informações
    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={(event) => handleSendQuestion(event)}>
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar perguntas
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
