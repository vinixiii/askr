//Packages
// import { useState } from "react";
import { useParams } from "react-router";

//Services
import { database } from "../services/firebase";

//Hooks
// import { useAuth } from "../hooks/useAuth";

//Images
import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";

//Styles
import "../styles/room.scss";

//Components
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { useHistory } from "react-router-dom";

//Types
type RoomParams = {
  id: string;
};

export function AdminRoom() {
  //Informações do usuário logado
  // const { user } = useAuth();
  const history = useHistory();
  //Armazena os parâmetros da URL na const params
  const params = useParams<RoomParams>();
  //Armazena o params.id na const roomId
  const roomId = params.id;
  //Traz as informações das perguntas (título, autor, avatar...)
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          <span>
            {questions.length} {questions.length > 1 ? "perguntas" : "pergunta"}
          </span>
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
