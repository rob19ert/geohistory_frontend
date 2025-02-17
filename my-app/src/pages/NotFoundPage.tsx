import React from "react";
import ErrorImage from "../components/default.jpg"; // Подключаем изображение

const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start", // Выравнивание по вертикали сверху
        justifyContent: "center", // Выравнивание по горизонтали по центру
        height: "100vh",
        paddingTop: "20vh",
      }}
    >
      <div>
        <h1 style={{ fontSize: "80px", margin: "0" }}>404</h1>
        <h2 style={{ fontSize: "30px", margin: "10px 0" }}>
          Страница не найдена
        </h2>
        <p style={{ fontSize: "18px", color: "#666" }}>
          Извините, мы не нашли запрашиваемую страницу.
        </p>
      </div>
      <img
        src={ErrorImage}
        alt="Ошибка 404"
        style={{
          maxWidth: "250px",
          marginBottom: "20px",
        }}
      />
    </div>
  );
};

export default NotFoundPage;