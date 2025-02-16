import { FC } from "react";
import { Button, Card } from "react-bootstrap";
import "./DiscovererCard.css";
import defaultImage from "./default.jpg";
import { ROUTES } from "../Routes";
import { discoveriesAddDiscovererCreate, setDiscoverers } from "../slices/discoveryDraftSlice";
import { getDiscoverersList } from "../slices/dataSlices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { discoveriesRead } from "../slices/discoveryDraftSlice";
import { deleteDiscovererFromDiscovery } from "../slices/discoveryDraftSlice";
import { useNavigate } from "react-router-dom";
interface Props {
  id?: number;
  name?: string;
  years_of_life?: string;
  image_url?: string | null;
  long_description?: string;
  isDetailed?: boolean;
  draft_count?: number;
  isDraft?:boolean;
  onClick?: () => void;
}

export const DiscovererCard: FC<Props> = ({
  id,
  name,
  years_of_life,
  image_url,
  long_description,
  isDetailed = false,
  draft_count,
  isDraft,
  onClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const { pathname } = useLocation();
  const discoveryData = useSelector((state: RootState) => state.discovery.discoveryData);
  const discoveryId = useSelector((state: RootState) => state.discovery.draft_id);
  const discovererId = useSelector((state: RootState) => state.discovery.discoverers)
  const discoverers = useSelector((state: RootState) => state.discovery.discoverers);
  const navigate = useNavigate();


  const handleDeleteCity = async () => {
    if (id && discoveryId) {
        await dispatch(deleteDiscovererFromDiscovery({ discovererId: id, discoveryId }));
        dispatch(setDiscoverers(discoverers.filter(discoverer => discoverer.id !== id)));
    }
};

  

  // Обработчик события "Добавить"
  const handleAdd = async () => {
    console.log("🟢 handleAdd вызван для ID первооткрывателя:", id);
  
    if (!id) {
      console.log("❌ Ошибка: id первооткрывателя отсутствует!");
      return;
    }
  
    const resultAction = await dispatch(discoveriesAddDiscovererCreate({ explorer_id: id }));
  
    if (discoveriesAddDiscovererCreate.fulfilled.match(resultAction)) {
      const newDiscoveryId = resultAction.payload.discovery_id;
  
      if (newDiscoveryId) {
        console.log("🚀 Перезапрос заявки с ID:", newDiscoveryId);
        dispatch(discoveriesRead(newDiscoveryId.toString()));
      }
    }
  };
  
  

  if (pathname === "/list_discoverer") {
    return (
    
      <Card className="discoverer-card" style={{ padding: "0", margin: "0" }}>
        <p className="textName">ИССЛЕДОВАТЕЛЬ</p>
        <Card.Img className="cardImage" variant="top" src={image_url || defaultImage} />
        <Card.Body className="card-body">
          <div className="titleStyle">
            <Card.Title>{name}</Card.Title>
          </div>
          <div className="textStyle">
            <Card.Text>{years_of_life}</Card.Text>
          </div>
          {isDetailed && long_description && (
            <div className="aboba">
              <Card.Text>{long_description}</Card.Text>
            </div>
          )}
          <Button className="cardButton" variant="none" onClick={() => navigate(`${ROUTES.SERVICES}/${id}`)}>
            Подробнее
          </Button>
          {isAuthenticated && (
            <Button className="cardButton" variant="none" onClick={handleAdd}>
                
              Добавить
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  }
  if (pathname.includes("/discoveries")) {
    return (
      <div className="discoverers-container">
        <Card className="fav-card">
          <Card.Body className="fav-card-body">
            {/* 🏷 Заголовок "ИССЛЕДОВАТЕЛЬ" */}
            <p className="textNames">ИССЛЕДОВАТЕЛЬ</p>
  
            {/* 🖼 Изображение */}
            <div className="text-center">
              <img className="fav-card-image" src={image_url || defaultImage} alt={name} />
            </div>
  
            {/* 🔥 Имя первооткрывателя */}
            <div className="card-title-style">
            <Card.Title className="fav-card-title">{name}</Card.Title>
            </div>
  
            {/* 🌍 Регион */}
            <div className="fav-card-info">
              <Row className="align-items-center">
                <Col xs={5} sm={4} md={3}>
                  <label className="fav-label">Регион:</label>
                </Col>
                <Col xs={7} sm={8} md={9}>
                  <input type="number" className="fav-input" value={draft_count} disabled />
                </Col>
              </Row>
            </div>
  
            {/* 🔘 Кнопки "Подробнее" и "Удалить" */}
            <Row className="fav-actions">
              <Col xs={12}>
                <Button variant="outline-primary" className="fav-btn" onClick={onClick}>
                  Подробнее
                </Button>
              </Col>
            </Row>
  
            {isDraft && (
              <Button className="fav-btn-open" onClick={handleDeleteCity}>
                Удалить
              </Button>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
  

  return null;
};
