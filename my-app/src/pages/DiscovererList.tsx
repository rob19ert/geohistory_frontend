import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { setSearchValue, getDiscoverersList } from "../slices/dataSlices";
import { DiscovererCard } from "../components/DiscovererCard";
import { Row, Col, Spinner, Button, Table } from "react-bootstrap";
import InputField from "../components/InputField";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTE_LABELS } from "../Routes";
import "./DiscovererList.css";
import { ROUTES } from "../Routes";
import { deleteDiscoverersAsync } from "../slices/discoverersEditSlice";
import { toast } from "react-toastify";

const DiscovererListPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const { searchValue, discoverers, loading } = useSelector(
    (state: RootState) => state.discoverers
  );
  const isSuperUser = useSelector((state: RootState) => Boolean(state.user.isSuperUser));

  useEffect(() => {
    dispatch(getDiscoverersList());
  }, [dispatch]);

  const handleCardClick = (
    id: number | undefined,
    action: "open" | "edit" | "delete"
  ) => {
    if (!id) return;
    switch (action) {
      case "open":
        navigate(`${ROUTES.SERVICES}/${id}`);
        break;
      case "edit":
        navigate(`${ROUTES.SERVICES}/${id}/edit`);
        break;
      case "delete":
        dispatch(deleteDiscoverersAsync({ id })).then(() => {
          dispatch(getDiscoverersList());
          toast.warn("Услуга удалена!", {
            position: "bottom-center",
            autoClose: 2000,
          });
        });
        break;
      default:
        console.warn("Неизвестное действие", action);
    }
  };
  console.log("Redux isSuperUser в компоненте:", isSuperUser); // ✅ Проверяем, что приходит в компонент

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
      {!isSuperUser ? (
        <div className="container">
          {loading ? (
            <div className="loadingBg">
              <Spinner animation="border" />
            </div>
          ) : discoverers.length === 0 ? (
            <div>
              <h1>Пусто</h1>
            </div>
          ) : (
            <Row className="g-2" style={{ marginInline: "auto" }}>
              {discoverers.map((discoverer) => (
                <Col
                  key={discoverer.id}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <DiscovererCard
                    id={discoverer.id}
                    name={discoverer.name}
                    years_of_life={discoverer.years_of_life}
                    image_url={discoverer.image_url}
                    long_description={discoverer.long_description}
                    onClick={() => handleCardClick(discoverer.id, "open")}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto p-4">
            <Table striped bordered hover responsive className="text-center">
              <thead className="table-header">
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Действие</th>
                  <th>Удалить</th>
                </tr>
              </thead>
              <tbody>
                {[...discoverers]
                  .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
                  .map((discoverer) => (
                    <tr key={discoverer.id} onClick={() => handleCardClick(discoverer.id, "open")}>
                      <td>{discoverer.id}</td>
                      <td>{discoverer.name}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCardClick(discoverer.id, "edit");
                          }}
                        >
                          Изменить
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCardClick(discoverer.id, "delete");
                          }}
                        >
                          Удалить
                        </Button>
                      </td>
                    </tr>
                  ))}
                <tr
                  className="add-service-row"
                  onClick={() => navigate(`${ROUTES.SERVICES}/add-service`)}
                >
                  <td colSpan={4} className="py-3">
                    <span style={{ color: "#207e2a" }}>✚</span>
                    <strong>Добавить нового первооткрывателя</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscovererListPage;
