//Packages
// import { useState } from "react";
import { useParams } from "react-router";

//Services
import { database } from "../services/firebase";

//Hooks
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

//Images
import logoImg from "../assets/images/logo-askr.svg";
import darkLogoImg from "../assets/images/dark-logo-askr.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

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
  const { user, signOut } = useAuth();
  const history = useHistory();
  const { theme, toggleTheme } = useTheme();

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

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleSignOut() {
    if (user) {
      await signOut();
      history.push("/");
    }
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <img src={theme === "light" ? logoImg : darkLogoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
            <Button isSignOut onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <div>
            <h1>Sala {title}</h1>
            <span>
              {questions.length}{" "}
              {questions.length > 1 ? "perguntas" : "pergunta"}
            </span>
          </div>
          <div className="toggle">
            <input id="switch" type="checkbox" />
            <label htmlFor="switch" onClick={toggleTheme}>
              Toggle
            </label>
          </div>
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                likesCount={question.likeCount}
                isAdmin
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                      {/* <p>Concluir</p> */}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                      {/* <p>Destacar</p> */}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                  {/* <p>Excluir</p> */}
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
