import {type FC} from "react";
import "./buttonStyles.scss";
import * as React from "react";

interface IButton {
    text?: string;
    icon?: string;
    altIcon?: string;
    btnStyles?: React.CSSProperties;
    iconStyles?: React.CSSProperties;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

const Button: FC<IButton> = ({
                                 onClick,
                                 text,
                                 icon,
                                 altIcon,
                                 iconStyles,
                                 disabled,
                                 type = "button",
                                 className = "",
                                 btnStyles
                             }) => {
    return (
        <button onClick={onClick} disabled={disabled} type={type}
                className={`button ${className} ${disabled ? "button--disabled" : ""}`} style={btnStyles}>
            {icon && <img src={icon} alt={altIcon} style={iconStyles} className="button__icon"/>}
            {text && <span className="button__text">{text}</span>}
        </button>
    );
};

export default Button;