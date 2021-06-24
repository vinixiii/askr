//Packages
import { FormEvent, useState } from "react";
import { useParams } from "react-router";
import { database } from "../services/firebase";

//Hooks
import { useAuth } from "../hooks/useAuth";

//Images
import logoImg from "../assets/images/logo.svg";

//Styles
import "../styles/room.scss";

//Components
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

//Types
type RoomParams = {
  id: string;
};

export function Room() {
  //Informações do usuário logado
  const { user } = useAuth();
  //Armazena os parâmetros da URL na const params
  const params = useParams<RoomParams>();
  //Armazena o params.id na const roomId
  const roomId = params.id;
  //Traz as informações das perguntas (título, autor, avatar...)
  const { questions, title } = useRoom(roomId);
  //Armazena as informações de uma nova pergunta
  const [newQuestion, setNewQuestion] = useState("");

  //Cria uma nova pergunta e armazena no banco de dados
  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    //Se o valor do input for vazio para a função por aqui
    if (newQuestion.trim() === "") {
      return;
    }

    //Se o usuário não estiver logado, exibe um erro
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
      isHighlighted: false,
      isAnswered: false,
    };

    //Mandas as informações do objeto question para o banco de dados
    //passando a referência rooms e o roomId, ou seja, dentro do objeto roomId
    //da referência será criado um novo objeto question com essas informações
    await database.ref(`rooms/${roomId}/questions`).push(question);

    //Reseta o valor do state newQuestion
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
          <h1>Sala {title}</h1>
          <span>
            {questions.length} {questions.length > 1 ? "perguntas" : "pergunta"}
          </span>
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

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
