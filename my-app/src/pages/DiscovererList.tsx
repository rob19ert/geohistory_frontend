import { DiscovererCard } from "../components/DiscovererCard";
import { Row, Col, Spinner } from "react-bootstrap";
import InputField from "../components/InputField";
import "./DiscovererList.css";
import { FC, useState, useEffect } from "react";
import { Discoverer, getDiscoverer } from "../modules/DiscovererApi";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTE_LABELS } from "../Routes";
import { DISCOVERER_MOCK } from "../modules/mock";

const DiscovererListPage: FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [discoverers, setDiscoverers] = useState<Discoverer[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getDiscoverer(searchValue);
      console.log('Response from API:', response);
      setDiscoverers(response.discoverers); // Используем только discoverers из ответа
    } catch (error) {
      console.error('Error fetching discoverers:', error);
      setDiscoverers(DISCOVERER_MOCK); 
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className={`container ${loading && 'containerLoading'}`}>
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SERVICES }]} />
      <InputField
        value={searchValue}
        setValue={(value) => setSearchValue(value)}
        loading={loading}
        onSubmit={handleSearch}
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
          <Row xs={1} md={2} lg={4} className="g-4" style={{ marginInline: 'auto' }}>
            {discoverers.map((item) => (
              <Col key={item.id} style={{ padding: '0px' }}>
                <DiscovererCard {...item} />
              </Col>
            ))}
          </Row>
        )
      )}
    </div>
  );
};

export default DiscovererListPage;
