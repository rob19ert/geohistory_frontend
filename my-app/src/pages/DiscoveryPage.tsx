import React, { ChangeEvent, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../Routes";
import { AppDispatch, RootState } from "../store";
import { completedDiscoveries, getDiscoveries, setStatus } from "../slices/discovererSlice";
import { Button, Table, Spinner, Row, Col, Form } from "react-bootstrap";
import { BreadCrumbs } from "../components/BreadCrumbs";

const DiscoveriesTablePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { discoveries, loading, status } = useSelector(
    (state: RootState) => state.discoveries
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDiscoveries());
  }, [dispatch]);

  const handleCardClick = (id: number | undefined) => {
    navigate(`${ROUTES.DISCOVERY}/${id}`);
  };

  const handleButtonClick = (
    id: number | undefined,
    action: "completed" | "rejected"
  ) => {
    if (!id) return;

    const discoveryData = discoveries.find((item) => item.id === id);
    if (!discoveryData) return;

    dispatch(completedDiscoveries({ id: id.toString(), action }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setStatus(e.target.value));
  };

  const filteredDiscoveries = discoveries.filter((item) =>
    status ? item.status === status : true
  );

  return (
    <>
      {loading && (
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      )}
      <BreadCrumbs
        crumbs={[
          {
            label: ROUTE_LABELS.DISCOVERY,
            path: ROUTES.DISCOVERY,
          },
        ]}
      />
      <div className="filter-container" style={{ padding: "20px", backgroundColor: "#f7f7f7" }}>
        <Row>
          <Col md={3}>
            <Form.Group controlId="statusFilter">
              <Form.Label>Статус</Form.Label>
              <Form.Control
                as="select"
                className="custom-focus"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="">Все</option>
                <option value="formed">Сформирована</option>
                <option value="completed">Принята</option>
                <option value="rejected">Отклонена</option>
                <option value="deleted">Удалена</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </div>
      <div className="overflow-x-auto p-4">
        <Table striped bordered hover responsive className="text-center">
          <thead className="table-header">
            <tr>
              <th>ID</th>
              <th>Статус</th>
              <th>Дата создания</th>
              <th>Дата компиляции</th>
              <th>Дата завершения</th>
              <th>Создатель</th>
              <th>Модератор</th>
              <th>Регион</th>
              <th>Действие</th>
              <th>Qr</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscoveries.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.status}</td>
                <td>{item.created_at}</td>
                <td>{item.formed_at}</td>
                <td>{item.completed_at}</td>
                <td>{item.creator_login}</td>
                <td>{item.moderator_login}</td>
                <td>{item.region}</td>
                <td>
                  <Button variant="success" onClick={() => handleCardClick(item.id)}>
                    Открыть
                  </Button>
                  {item.status === "formed" && (
                    <>
                      <Button
                        variant="success"
                        className="mx-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleButtonClick(item.id, "completed");
                        }}
                      >
                        Принять
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleButtonClick(item.id, "rejected");
                        }}
                      >
                        Отклонить
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};
export default DiscoveriesTablePage;