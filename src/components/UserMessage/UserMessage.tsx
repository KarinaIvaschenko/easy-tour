import type { FC } from "react";
import "./userMessageStyles.scss";
import type {StatusMessage} from "../../helpers/types.ts";

interface IUserMessage {
    message?: string;
    type: StatusMessage;
}

const UserMessage: FC<IUserMessage> = ({ message = "", type }) => {
    const typeConfig: Record<IUserMessage['type'], { prefix: string, className: string }> = {
        success: { prefix: '✅ Успіх! ', className: 'user-message--success' },
        error:   { prefix: '❌ Помилка: ', className: 'user-message--error' },
        warning: { prefix: '⚠️ Попередження: ', className: 'user-message--warning' },
        emptyState:    { prefix: 'ℹ️ Інформація: ', className: 'user-message--emptyState' },
    };

    const { prefix, className } = typeConfig[type];

    return (
        <div className={`user-message ${className}`}>
            <p className="user-message__text">{prefix}{message}</p>
        </div>
    );
};

export default UserMessage;
