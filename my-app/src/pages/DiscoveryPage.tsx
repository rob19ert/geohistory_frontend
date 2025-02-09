import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../Routes";
import { AppDispatch, RootState } from "../store";
import { getDiscoveries } from "../slices/discovererSlice";
import { Button, Table, Spinner } from "react-bootstrap";

import { BreadCrumbs } from "../components/BreadCrumbs";

const DiscoveriesTablePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { discoveries, loading } = useSelector(
    (state: RootState) => state.discoveries
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDiscoveries());
  }, [dispatch]);

  const handleCardClick = (id: number | undefined) => {
    navigate(`${ROUTES.DISCOVERY}/${id}`);
  };

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
      <div className="overflow-x-auto p-4">
        <Table striped bordered hover responsive className="text-center">
          <thead className="table-header">
            {" "}
            {/* Применяем кастомный класс */}
            <tr>
              <th>ID</th>
              <th>Статус</th>
              <th>Дата создания</th>
              <th>Дата компиляции</th>
              <th>Дата завершения</th>

              <th>Создатель</th>
              <th>Модератор</th>
              <th>Регион</th>
            </tr>
          </thead>
          <tbody>
            {discoveries.map((item) => (
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
                  <Button
                    variant="success"
                    onClick={() => handleCardClick(item.id)}
                  >
                    Открыть
                  </Button>
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