import "./DiscovererDetail.css"
import {FC, useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useParams } from "react-router-dom";
import { Discoverer, getDiscovererId } from "../modules/DiscovererApi";
import {Col, Row, Spinner, Image } from "react-bootstrap";
import { DISCOVERER_MOCK } from "../modules/mock";
import defaultImg from "../components/columb.jpg"

export const DiscovererDetailPage: FC = () => {
    const [pageData, setPageData] = useState<Discoverer>();
    const {id}=useParams();

  useEffect(() => {
    if (!id) return;
    getDiscovererId(id)
    .then((response) => setPageData(response))
    .catch(() =>
        setPageData (
            DISCOVERER_MOCK.find((discoverer) => String(discoverer.id) == id)
        )
    );
  }, [id]);

  return (
    <div>
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.SERVICES, path: ROUTES.SERVICES },
          { label: pageData?.name || "Услуга" },
        ]}
      />
      {pageData ? ( // проверка на наличие данных, иначе загрузка
        <div className="container2">
            <div className="penis">
        <Row className="justify-content-center">
          <Col md={12} className="text-center">
            <p className="font-60">{pageData.name}</p> {/* Имя сверху */}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Image className="image" src={pageData.image_url || defaultImg} alt="Картинка" />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={12} className="text-center">
            <p className="font-10">Годы жизни: {pageData.years_of_life}</p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={12}>
            {pageData.long_description?.split("\n").map((paragraph, index) => (
              <p key={index} className="font-10">Открытие: {paragraph}</p> 
            ))}
          </Col>
        </Row>
        </div>
      </div>
      
      ) : (
        <div className="album_page_loader_block">{/* загрузка */}
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};