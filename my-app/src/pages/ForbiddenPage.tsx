import React from "react";
import ErrorImage from "../components/default.jpg"; // Подключаем изображение

const ForbiddenPage: React.FC = () => {
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
        <h1 style={{ fontSize: "80px", margin: "0" }}>403</h1>
        <h2 style={{ fontSize: "30px", margin: "10px 0" }}>Доступ запрещен</h2>
        <p style={{ fontSize: "18px", color: "#666" }}>
          У вас нет прав для доступа к этой странице.
        </p>
      </div>
      <img
        src={ErrorImage}
        alt="Ошибка 403"
        style={{
          maxWidth: "250px",
          marginBottom: "20px",
        }}
      />
    </div>
  );
};

export default ForbiddenPage;