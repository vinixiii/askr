import copyImg from "../assets/images/copy.svg";

import "../styles/room-code.scss";

//Define que o tipo do code é string
type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  //Copia o código da sala
  function copyRoomCodeToClipboard() {
    //Copia o código da sala para a área de transferência
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copiar o código da sala" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}
