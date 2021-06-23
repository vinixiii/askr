//Packages
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

//Types
//Define quais informações o objeto user terá
type User = {
  id: string;
  name: string;
  avatar: string;
};

//Define quais informações terão dentro do Context
type AuthContextType = {
  //Pode ser do tipo User ou undefined pois no início não há usuário logado
  user: User | undefined;
  //Toda função async devolve uma Promise, que nesse caso tem o retorno vazio
  signInWithGoogle: () => Promise<void>;
};

//Define a tipagem para as props do AuthContextProvider
type AuthContextProviderProps = {
  //Define que a prop children é um componente do React
  children: ReactNode;
};

//Cria um context e define a tipagem desse context como AuthContextType
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  //Estado de autenticação do usuário
  //Define que o user tem a tipagem do User
  const [user, setUser] = useState<User>();

  useEffect(() => {
    //Define um listener para o estado de autenticação do usuário,
    //ou seja, se o usuário já fez um login anteriormente essa função irá retornar
    //os dados desse usuário mesmo ao recarregar a página
    auth.onAuthStateChanged((user) => {
      //Se houver informações no user
      if (user) {
        //Pega os seguintes dados do usuário
        //displayName = Nome do usuário
        //photoURL = Path da imagem do usuário
        //uid = id único do usuário
        const { displayName, photoURL, uid } = user;

        //Se o usuário não tiver nome ou foto, lança um erro
        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }

        //Se o usuário tiver nome e foto, define o valor do state user
        //com as informações obtidas na autenticação
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });
  }, []);

  async function signInWithGoogle() {
    //Define que o provider para a autenticação será o do Google
    const provider = new firebase.auth.GoogleAuthProvider();

    //Define que a autenticação será feita em um janela popup passando o provider
    const result = await auth.signInWithPopup(provider);

    //Se tiver um user no result
    if (result.user) {
      //Pega os seguintes dados do usuário
      //displayName = Nome do usuário
      //photoURL = Path da imagem do usuário
      //uid = id único do usuário
      const { displayName, photoURL, uid } = result.user;

      //Se o usuário não tiver nome ou foto, lança um erro
      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account");
      }

      //Se o usuário tiver nome e foto, define o valor do state user
      //com as informações obtidas na autenticação
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
