import { FC } from "react";
import {InputGroup, Col, Button, Row, Container, Card, Form, } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { NavLink, useNavigate } from "react-router-dom";
//import "./LoginPage.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { regUsersAsync } from "../slices/userSlice";
import { toast } from "react-toastify";
import "./RegisterPage.css";


export const RegisterPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const error = useSelector((state: RootState) => state.user.error);

  // Обработчик события изменения полей ввода
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.warn("Пароли не совпадают!", {
        position: "bottom-right",
        autoClose: 2000, // Авто-закрытие через 3 сек
      });
      return;
    }
    if (formData.username && formData.password) {
      try {
        await dispatch(regUsersAsync(formData)).unwrap();
        navigate(`${ROUTES.LOGIN}`);
        toast.success("Пользователь зарегистрирован", {
          position: "bottom-right",
          autoClose: 2000, // Авто-закрытие через 3 сек
        });
      } catch (error) {
        toast.warn("Такой пользователь уже существует", {
          position: "bottom-right",
          autoClose: 2000, // Авто-закрытие через 3 сек
        });
      }
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <Card.Body className="cardio-body">
          <h2 className="register-title">Регистрация</h2>
          <p className="register-subtitle">Пожалуйста, введите свои данные!</p>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3" controlId="formUsername">
                <Form.Label>Логин</Form.Label>
                <Form.Control
                  name="username"
                  type="text"
                  placeholder="Введите логин"
                  className="custom-focus"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Введите email"
                  className="custom-focus"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3" controlId="formPassword">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Введите пароль"
                  className="custom-focus"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Подтвердите пароль</Form.Label>
                <Form.Control
                  name="confirmPassword"
                  type="password"
                  placeholder="Повторите пароль"
                  className="custom-focus"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
            <div className="d-grid">
              <Button variant="success" type="submit" className="register-button">
                Регистрация
              </Button>
            </div>
          </Form>
          <p className="register-footer">
            Уже есть аккаунт? <NavLink to={ROUTES.LOGIN}>Авторизация</NavLink>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}