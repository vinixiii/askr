//Packages
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

//Hooks
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

//Images
import logoImg from "../assets/images/logo-askr.svg";

//Styles
import "../styles/room.scss";

//Components
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

//Types
type RoomParams = {
  id: string;
};

export function Room() {
  //Informações do usuário logado
  const { user, signInWithGoogle, signOut } = useAuth();
  //Navegação entre páginas
  const history = useHistory();
  //Armazena os parâmetros da URL na const params
  const params = useParams<RoomParams>();
  //Armazena o params.id na const roomId
  const roomId = params.id;
  //Traz as informações das perguntas (título, autor, avatar...)
  const { questions, title } = useRoom(roomId);
  //Armazena as informações de uma nova pergunta
  const [newQuestion, setNewQuestion] = useState("");

  //Direciona para a página de criação de salas
  async function handleSignIn() {
    //Se o usuário não estiver autenticado
    if (!user) {
      //Faz o login com o Google
      await signInWithGoogle();
    }

    //Se estiver autenticado, redireciona para a página de criação de salas
    history.push(`/rooms/${roomId}`);
  }

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

  //Cria um novo like e armazena no banco de dados
  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (user) {
      if (likeId) {
        //Remove o like
        //Acessa a referência rooms/questions e remove os likes
        await database
          .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
          .remove();
      } else {
        //Da like

        //Acessa a referência rooms/questions e cria uma lista de likes
        //passando o autor do like
        await database
          .ref(`rooms/${roomId}/questions/${questionId}/likes`)
          .push({
            authorId: user?.id,
          });
      }
    }
  }

  async function handleSignOut() {
    if (user) {
      await signOut();
      history.push("/");
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isSignOut onClick={handleSignOut}>
              Sair
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
                Para enviar uma pergunta,{" "}
                <button onClick={handleSignIn}>faça seu login</button>.
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <button
                    type="button"
                    className={`like-button ${question.likeId ? "liked" : ""}`}
                    aria-label="Marcar como gostei"
                    onClick={() => {
                      handleLikeQuestion(question.id, question.likeId);
                    }}
                  >
                    {question.likeCount > 0 && (
                      <span>{question.likeCount}</span>
                    )}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
