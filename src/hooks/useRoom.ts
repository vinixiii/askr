import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

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
    likes: Record<string, { 
      authorId: string;
    }>;
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
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
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
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestion);
    });

    //Se desinscereve do listener aplicado no roomRef
    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return { questions, title };
}