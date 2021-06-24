//Packages
import { FormEvent, useEffect, useState } from "react";
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

//Types
type RoomParams = {
  id: string;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type Questions = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function Room() {
  //Armazena os parâmetros da URL na const params
  const params = useParams<RoomParams>();
  //Armazena o params.id na const roomId
  const roomId = params.id;
  //Informações do usuário logado
  const { user } = useAuth();

  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    //Adiciona um event listener para o evento value
    //que traz todos os valores da referência
    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      //Transforma o objeto das questions em um array com dois índices
      //[0] -> id da question
      //[1] -> Objeto com as informações da question
      const parsedQuestion = Object.entries(firebaseQuestions).map(
        //Pega o índice[0] e o índice[1] do array e cria um objeto
        //com as informações dos índices
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestion);
    });
  }, [roomId]);

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
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
