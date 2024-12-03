import './HomePage.css'
import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import { Button, Col, Container, Row, Carousel } from "react-bootstrap"
import imgCarouselOne from '../components/ImageOne.jpg'
import imgCarouselTwo from '../components/ImageTwo.jpg'
import imgCarouselThree from '../components/ImageThree.jpg'

export const HomePage: FC = () => {
    return (
        <Container style={{ display: 'flex', alignItems: 'center', marginTop: '0px'}}>
      <Row>
        <Col md={6}>
          {/* <p className="font-40" id='font-40-home'>
            Эпоха географических открытий
          </p>  */}
          {/* <Link to={ROUTES.SERVICES}>
            <Button variant="primary">Просмотреть первооткрывателей</Button>
          </Link> */}
        </Col>
      </Row>

      <Carousel style={{width: '100%', height: '100%'}}>
        <Carousel.Item interval={1500}>
            <img className="d-block w-100 mx-auto" src={imgCarouselOne} alt="Image One" />
            <Carousel.Caption>
            <Link to={ROUTES.SERVICES}>
            {/* <Button variant="primary">Просмотреть первооткрывателей</Button> */}
          </Link>
                {/* <h3> Изучай мир! Знай историю!</h3> */}
            </Carousel.Caption>
        </Carousel.Item>

      <Carousel.Item interval={1500}>
            <img className="d-block w-100 mx-auto" src={imgCarouselTwo} alt="Image Two" />
            <Carousel.Caption>
            <Link to={ROUTES.SERVICES}>
            {/* <Button variant="primary">Просмотреть первооткрывателей</Button> */}
          </Link>
                {/* <h3> Более 20 первооткрывателей!</h3> */}
            </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={1500}>
            <img className="d-block w-100 mx-auto" src={imgCarouselThree} alt="Image Three" />
            <Carousel.Caption>
            <Link to={ROUTES.SERVICES}>
            {/* <Button variant="primary">Просмотреть первооткрывателей</Button> */}
          </Link>
                {/* <h3> Будь любознательным! </h3> */}
            </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
    )
}

