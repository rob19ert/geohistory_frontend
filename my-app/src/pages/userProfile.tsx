import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { ROUTE_LABELS, ROUTES } from "../Routes";
import { NavLink } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { updateUserAsync } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { toast } from "react-toastify";
import './userProfile.css';

const UserProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {  username, email } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    username: username || "",
    email: email || "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      username: username || "",
      email: email || "",
    }));
  }, [username, email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.warn("Пароли не совпадают!", { position: "bottom-right", autoClose: 2000 });
      return;
    }
  
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value.trim() !== "" && key !== "confirmPassword")
    );
  
    // Гарантируем наличие username, если он был пустым
    if (!filteredData.username) {
      filteredData.username = username; // Берём из состояния Redux
    }
  
    try {
      console.log("Отправка данных на бэкенд:", filteredData);
      await dispatch(updateUserAsync(filteredData as { username: string; password?: string; email?: string })).unwrap();
      toast.success("Профиль успешно обновлён!", { position: "bottom-right", autoClose: 2000 });
  
      // Очистка пароля после успешного обновления
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error: any) {
      const errorMsg = error || "Ошибка обновления профиля";
      toast.error(errorMsg, { position: "bottom-right", autoClose: 2000 });
    }
  };
  

  return (
    <>
      <Container fluid className="profile-container">
        
          
            <Card className="profile-card">
              <Card.Body className="cardio">
                <h2 className="text-center fw-bold mb-4">Настройки аккаунта</h2>
                <p className="text-center mb-4">Привет, {username}! Измените свои данные ниже.</p>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                      name="username"
                      type="text"
                      placeholder="Введите новый логин"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email адрес</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Введите новый email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                          name="password"
                          type="password"
                          placeholder="Введите новый пароль"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group controlId="formConfirmPassword" className="mb-3">
                        <Form.Label>Подтвердите пароль</Form.Label>
                        <Form.Control
                          name="confirmPassword"
                          type="password"
                          placeholder="Повторите новый пароль"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" className="custom-button w-100">
                    Сохранить изменения
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <NavLink to={ROUTES.HOME} className="custom-link">
                    Вернуться на главную
                  </NavLink>
                </div>
              </Card.Body>
            </Card>
          
        
      </Container>
    </>
  );
};

export default UserProfilePage;