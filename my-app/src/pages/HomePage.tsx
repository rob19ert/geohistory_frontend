import './HomePage.css'
import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import {  Col, Container, Row, Carousel } from "react-bootstrap"
import imgCarouselOne from '../components/home6.jpg'
import imgCarouselTwo from '../components/home7.jpg'
import imgCarouselThree from '../components/home8.jpg'


export const HomePage: FC = () => {
  return (
    <Container className="homePage">
      <div className="carousel-container">
        <h1>Великие первооткрыватели мира</h1>
        <Carousel>
          <Carousel.Item interval={1500}>
            <img className="d-block w-100" src={imgCarouselOne} alt="Image One" />
            
          </Carousel.Item>

          <Carousel.Item interval={1500}>
            <img className="d-block w-100" src={imgCarouselTwo} alt="Image Two" />
            
          </Carousel.Item>

          <Carousel.Item interval={1500}>
            <img className="d-block w-100" src={imgCarouselThree} alt="Image Three" />
            
          </Carousel.Item>
        </Carousel>
      </div>
    </Container>
  );
};