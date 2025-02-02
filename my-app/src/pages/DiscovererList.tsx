import { DiscovererCard } from "../components/DiscovererCard";
import { Row, Col, Spinner } from "react-bootstrap";
import InputField from "../components/InputField";
import "./DiscovererList.css";
import { FC, useState, useEffect } from "react";
import { Discoverer, getDiscoverer } from "../modules/DiscovererApi";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTE_LABELS } from "../Routes";
import { DISCOVERER_MOCK } from "../modules/mock";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setSearchTerm } from '../slices/dataSlices';

const DiscovererListPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [discoverers, setDiscoverers] = useState<Discoverer[]>([]);

  const dispatch = useDispatch();
  const handleSearchSubmit = () => {
    dispatch(setSearchTerm(searchValue));
  };

  const { searchTerm } = useSelector(
    (state: RootState) => state.filter
  );
  
  const [searchValue, setSearchValue] = useState<string>(searchTerm);

  // Восстановление состояния из localStorage при загрузке
  useEffect(() => {
    const savedSearchTerm = localStorage.getItem('searchTerm');
    if (savedSearchTerm) {
      dispatch(setSearchTerm(savedSearchTerm));
      setSearchValue(savedSearchTerm);
    }
  }, [dispatch]);

  // Сохранение состояния в localStorage при изменении searchTerm
  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getDiscoverer(searchValue);
      console.log('Response from API:', response); // Проверка ответа
      setDiscoverers(response); // response — это массив discoverers
    } catch (error) {
      console.error('Error fetching discoverers:', error);
      const filteredDiscoverers = DISCOVERER_MOCK.filter((discoverer) => {
        return searchTerm ? discoverer.name.toLowerCase().startsWith(searchTerm.toLowerCase()) : true;
      });
      console.log('Filtered Discoverers:', filteredDiscoverers); // Проверка фильтрации
      setDiscoverers(filteredDiscoverers); // Используем mock данные
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return (
    <div className={`content ${loading && 'containerLoading'}`}>
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SERVICES }]} />
      <InputField
        value={searchValue}
        setValue={(value) => {
          dispatch(setSearchTerm(value));
          setSearchValue(value);
        }}
        loading={loading}
        onSubmit={handleSearchSubmit}
        placeholder="Поиск по имени"
        buttonTitle="Найти"
      />

      {loading ? (
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      ) : (
        !discoverers.length ? (
          <div>
            <h1>Пусто</h1>
          </div>
        ) : (
          <Row className="custom-row" style={{marginInline:'auto'}}>
            {discoverers.map((discoverer) => (
              <Col key={discoverer.id} style={{ padding: '10px' }}>
                <DiscovererCard
                  id={discoverer.id}
                  name={discoverer.name}
                  years_of_life={discoverer.years_of_life}
                  image_url={discoverer.image_url}
                  long_description={discoverer.long_description}
                />
              </Col>
            ))}
          </Row>
        )
      )}
    </div>
  );
};

export default DiscovererListPage;