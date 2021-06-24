//Importa uma interface que contém todos os atributos que um botão HTML pode receber
import { ButtonHTMLAttributes } from "react";

//Styles
import "../styles/button.scss";

//Define que as propriedades do botão são todas as propriedades contidas no ButtonHTMLAttributes
//passando entre <> a tipagem do botão, que no caso é um HTMLButtonElement
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

//Recebe como props isOutlined e o resto das props,
//ou seja,todas as outras props que não a isOutlined
export function Button({ isOutlined = false, ...props }: ButtonProps) {
  //Através do spread operator (...) são passadas todas as props para o botão
  return (
    <button className={`button ${isOutlined ? "outlined" : ""}`} {...props} />
  );
}
