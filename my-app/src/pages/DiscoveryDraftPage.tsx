import { FC, useEffect } from "react";
import { Col, Row, Image, Alert, Button, Form } from "react-bootstrap";
import CartImage from "../components/cart-icon.png";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { discoveriesRead } from "../slices/discoveryDraftSlice";
import { ROUTES } from "../Routes";
import { DiscovererCard } from "../components/DiscovererCard";
import { deleteDiscoveries, setError, submitDiscoveries } from '../slices/discoveryDraftSlice';
import { updateDiscoveries,setDiscoveryData } from "../slices/discoveryDraftSlice";
import "./DiscoveryDraftPage.css"

const CartPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isDraft = useSelector((state: RootState) => state.discovery.isDraft);
const {id} = useParams();

const handleDelete = async (e: React.FormEvent) => {
  e.preventDefault();
  if (id) {
    try {
      await dispatch(deleteDiscoveries(id)).unwrap();
      navigate(ROUTES.SERVICES);
    } catch (error) {
      dispatch(setError(error));
    }
  }
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(
        setDiscoveryData({
            ...discoveryData,
            [name]: value,
        })
    );
  };

  const handleSaveVacancy = () => {
    if (id) {
        const allowedStatuses = ["completed", "rejected", "draft", "deleted", "formed"] as const;
        const discoveryDataToSend = {
          id: discoveryData.id, 
          status: allowedStatuses.includes(discoveryData.status as any) 
        ? (discoveryData.status as "completed" | "rejected" | "draft" | "deleted" | "formed") 
        : "draft",
          region: discoveryData.region ?? '',
          discoverers: discoveryData.discoverers
        };
      try {
        dispatch(updateDiscoveries({id: id, discoveryData: discoveryDataToSend }));
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }
  const handleSubmitApplication = async () => {
    if (id) {
      try {
        await dispatch(submitDiscoveries(id)).unwrap();
        navigate(ROUTES.SERVICES); // Перенаправление после успешной отправки
      } catch (error) {
        dispatch(setError(error));
      }
    }
  };
  


  const { discoverers, discoveryData, error } = useSelector(
    (state: RootState) => state.discovery
  );
  console.log("📡 Текущее значение ID:", discoveryData?.id);

  
  console.log("🚀 Initial Redux State discoveryData:", discoveryData);

  useEffect(() => {
    console.log("🔍 Текущее значение ID:", id);
    
    if (id) {
      console.log("🗑️ Очищаем старые данные...");
      dispatch(setDiscoveryData(null)); // Очистка перед загрузкой
      dispatch(discoveriesRead(id));
    }
  }, [dispatch, id]);
  
  
  

  const handleCardClick = (id?: number) => {
    if (id) navigate(`/list_discoverer/${id}`);
  };

  return (
    <div className="container-2">
      <div className="cart-content">
        {error && <Alert variant="danger" style={{ width: "15vw" }}>{error}</Alert>}
        
       

        {isDraft ? (
          <>
            <Form.Group controlId="id">
              <h4>ID заявки:</h4>
              <Form.Control
                type="text"
                style={{height: "50px"}}
                name="id"
                value={discoveryData?.id ?? ''}
                onChange={handleInputChange}
                required
                disabled={!isDraft}
              />
            </Form.Group>

            <Form.Group controlId="status">
              <h4>Статус:</h4>
              <Form.Control
                style={{height: "50px"}}
                as="textarea"
                name="status"
                value={discoveryData?.status ?? ''}
                onChange={handleInputChange}
                rows={4}
                required
                disabled={!isDraft}
              />
            </Form.Group>

            <Form.Group controlId="region">
              <h4>Регион:</h4>
              <Form.Control
                as="textarea"
                style={{height: "50px"}}
                name="region"
                value={discoveryData?.region ?? ''}
                onChange={handleInputChange}
                rows={4}
                required
                disabled={!isDraft}
              />
            </Form.Group>


          </>
        ) : (
          discoveryData && (
            <>
              <h4>ID заявки: {discoveryData.id}</h4>
              <h4>Статус: {discoveryData.status}</h4>
              <h4>Регион: {discoveryData.region}</h4>
            </>
          )
        )}

        <h1>Добавленные первооткрыватели</h1>
        <div className="cards-wrapper-2 d-flex flex-column">
          {discoverers.length ? (
            discoverers.map((item) => (
              <Col key={item.id} className="mb-3">
                <DiscovererCard isDraft={isDraft} {...item} onClick={() => handleCardClick(item.id)} />
              </Col>
            ))
          ) : (
            <section className="discoverers-not-found">
              <h1>Корзина пуста</h1>
            </section>
          )}
        </div>

        <div className="button-group">
          {isDraft && (
            <Button className="cart-button" onClick={handleDelete}>
              Очистить
            </Button>
          )}

          <Button type="submit" className="cart-button" onClick={handleSaveVacancy}>
            Сохранить
          </Button>

          <Button type="submit" className="cart-button" onClick={handleSubmitApplication}>
            Оформить заявку
          </Button>
        </div>


      </div>
    </div>
  );
};

export default CartPage;