import "./loaderStyles.scss";

const Loader = () => {
    return (
        <div className="loader">
            <p className="loader__time">⏳</p>
            <p className="loader__text">Шукаємо тури...</p>
        </div>
    );
};

export default Loader;