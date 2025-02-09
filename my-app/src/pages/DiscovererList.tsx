import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { setSearchValue, getDiscoverersList } from "../slices/dataSlices";
import { DiscovererCard } from "../components/DiscovererCard";
import { Row, Col, Spinner } from "react-bootstrap";
import InputField from "../components/InputField";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTE_LABELS } from "../Routes";
import "./DiscovererList.css";
import { DISCOVERER_MOCK } from "../modules/mock";


const DiscovererListPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { searchValue, discoverers, loading } = useSelector((state: RootState) => state.discoverers);

  useEffect(() => {
    dispatch(getDiscoverersList());
  }, [dispatch]); // Обновляем при изменении searchValue

  const handleCardClick = (discoverer_id: number | undefined) => {
    if (discoverer_id !== undefined) {
      navigate(`${DISCOVERER_MOCK}/${discoverer_id}`);
    }
  };

  return (
    <div className={`content ${loading && "containerLoading"}`}>
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SERVICES }]} />
      <InputField
        value={searchValue}
        setValue={(value) => dispatch(setSearchValue(value))}
        loading={loading}
        onSubmit={() => dispatch(getDiscoverersList())}
        placeholder="Поиск по имени"
        buttonTitle="Найти"
      />

      {loading ? (
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      ) : !discoverers.length ? (
        <div>
          <h1>Пусто</h1>
        </div>
      ) : (
        <Row className="custom-row" style={{ marginInline: "auto" }}>
          {discoverers.map((discoverer) => (
            <Col key={discoverer.id} style={{ padding: "10px" }}>
              <DiscovererCard
                id={discoverer.id}
                name={discoverer.name}
                years_of_life={discoverer.years_of_life}
                image_url={discoverer.image_url}
                long_description={discoverer.long_description}
                onClick={() => handleCardClick(discoverer.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DiscovererListPage;
