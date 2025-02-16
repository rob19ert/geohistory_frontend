import { FC, HtmlHTMLAttributes, useEffect } from "react";
import { InputGroup,Col, Button,Row,Container,Card,Form} from "react-bootstrap";
import { ROUTE_LABELS, ROUTES } from "../Routes";
import { NavLink, RouterProviderProps, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
//import { regUserAsync } from "../slices/userSlice";
import { BreadCrumbs } from "../components/BreadCrumbs";
import {addDiscoverersAsync,getDiscoverersDetail,setDiscoverer,updateDiscoverersAsync, uploadImage} from "../slices/discoverersEditSlice";
//import { setDiscoveyData } from "../slices/discoveryDraftSlice";
import { Root } from "react-dom/client";
import { toast } from "react-toastify";
import { FormEvent } from "react";
import './DiscovererEditPage.css';

export const DiscovererEditPage: FC=() => {
    const {id} = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isDraft = useSelector(
        (state: RootState) => state.discovery.isDraft
    );
    const {discoverers, loading, error} = useSelector (
        (state: RootState) => state.discovererEdit
    );
   

    useEffect(() => {
      if (id) {
        dispatch(getDiscoverersDetail(id));
      } else {
        dispatch(setDiscoverer([]));
      }
      console.log("Текущий discoverers:", discoverers); // Проверяем объект
    }, [dispatch, id]);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      
      dispatch(
        setDiscoverer({
          ...discoverers,  // Используем существующие данные
          [name]: value,   // Обновляем только одно поле
        })
      );
    };


    

    const handleSaveDiscoverer = async (event: FormEvent) => {
        event.preventDefault();
        if (id) {
            try{
                await dispatch(updateDiscoverersAsync({id, discoverers})).unwrap();
                navigate(`${ROUTES.SERVICES}`);
                toast.success("Услуга обновлена!", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
            } catch (error) {
                toast.error("Ошибка!", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
            }
        } else {
            try{
                await dispatch(addDiscoverersAsync({discoverers})).unwrap();
                navigate(`${ROUTES.SERVICES}`);
                toast.success("Услуга добавлена!", {
                    position: "bottom-right",
                    autoClose: 2000,
                })
            } catch (error) {
                toast.error("Ошибка!", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
            }
        }
    };


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && discoverers?.id) {  // Убеждаемся, что id существует
        dispatch(uploadImage({ id: String(discoverers.id), file }));

      } else {
        toast.error("Ошибка: нельзя загрузить изображение без сохранённого первооткрывателя!", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    };
    
  
    return (
      <>
        <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.SERVICES, path: ROUTES.SERVICES },
            { label: id ? "Редактирование услуги" : "Добавление услуги" },
          ]}
        />
        <Container className="edit-container" style={{ background: "#e8e6e6" }}>
          <Row className="d-flex justify-content-center align-items-center">
            <Col md={10} lg={8} xs={12}>
              <Card className="edit-page" style={{ padding: "15px" }}>
                <Card.Body className="cardio-edit">
                  <div className="mb-3 mt-3">
                    <h2 className="fw-bold text-uppercase mb-2 text-center">
                      {id ? "Редактирование услуги" : "Добавление новой услуги"}
                    </h2>
                    <p className="mb-4 text-center">
                      {id
                        ? "Измените данные услуги и сохраните изменения."
                        : "Добавьте данные услуги и сохраните изменения."}
                    </p>
    
                    <Form onSubmit={handleSaveDiscoverer}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              required
                              className="custom-focus"
                              style={{ height: "40px" }}
                              value={discoverers?.name || ""}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
    
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Национальность</Form.Label>
                            <Form.Control
                              type="text"
                              name="nationality"
                              className="custom-focus"
                              style={{ height: "40px" }}
                              value={discoverers?.nationality || ""}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
    
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Годы жизни</Form.Label>
                            <Form.Control
                              type="text"
                              name="years_of_life"
                              className="custom-focus"
                              style={{ height: "40px" }}
                              value={discoverers?.years_of_life || ""}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
    
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Главное открытие</Form.Label>
                            <Form.Control
                              type="text"
                              name="major_discovery"
                              className="custom-focus"
                              style={{ height: "40px" }}
                              value={discoverers?.major_discovery || ""}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
    
                      <Form.Group className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="long_description"
                          style={{ height: "80px" }}
                          rows={2}
                          className="custom-focus"
                          value={discoverers?.long_description || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
    
                      <Form.Group className="mb-3">
                        <Form.Label>Био</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="bio"
                          style={{ height: "50px" }}
                          rows={2}
                          className="custom-focus"
                          value={discoverers?.bio || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
    
                      <Form.Group className="mb-3">
                        <Form.Label>Статус</Form.Label>
                        <Form.Control
                          type="text"
                          name="status"
                          style={{ height: "40px" }}
                          className="custom-focus"
                          value={discoverers?.status || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
    
                      <Form.Group className="mb-3">
                        <Form.Label>Изображение</Form.Label>
                        <Form.Control
                          type="file"
                          name="image_url"
                          
                          className="custom-focus"
                          onChange={handleFileUpload}
                        />
                      </Form.Group>
    
                      <div className="d-flex justify-content-center mt-3">
                        <Button variant="success" type="submit">
                          Сохранить
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }    