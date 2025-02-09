import { Navbar, Nav, Container } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { logoutUserAsync } from "../slices/userSlice";
import { setSearchValue, getDiscoverersList } from "../slices/dataSlices";

const linkStyle = {
  fontWeight: 700,
  fontSize: "18px",
  color: "#fff",
  textDecoration: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  transition: "background 0.3s ease-in-out",
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector((state: RootState) => state.user.username);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleExit = async () => {
    await dispatch(logoutUserAsync());
    dispatch(setSearchValue(""));
    navigate("/discoverers");
    await dispatch(getDiscoverersList());
  };

  return (
    <Navbar
      style={{
        width: "100%",
        height: "54px",
        background: "#607848",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <Container
        fluid
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Домой */}
        <NavLink to={ROUTES.HOME} style={linkStyle}>
          Домой
        </NavLink>

        <Nav style={{ display: "flex", gap: "20px" }}>
          {/* Услуги */}
          <NavLink to={ROUTES.SERVICES} style={linkStyle}>
            Услуги
          </NavLink>

          {/* 🔹 Добавляем ссылку на "Открытия" */}
          {isAuthenticated && (
            <NavLink to={ROUTES.DISCOVERY} style={linkStyle}>
              Открытия
            </NavLink>
          )}

          {/* Имя пользователя */}
          {isAuthenticated && (
            <NavLink to={ROUTES.SERVICES} style={linkStyle}>
              {username}
            </NavLink>
          )}

          {/* Кнопка Войти */}
          {!isAuthenticated && (
            <NavLink to={ROUTES.LOGIN} style={linkStyle}>
              Войти
            </NavLink>
          )}

          {/* Кнопка Выйти */}
          {isAuthenticated && (
            <NavLink to={ROUTES.LOGIN} onClick={handleExit} style={linkStyle}>
              Выйти
            </NavLink>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
