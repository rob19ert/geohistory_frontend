import { FC } from 'react'
import { Button, Card } from 'react-bootstrap';
import './DiscovererCard.css';
import defaul from './default.jpg'
import { ROUTES } from '../Routes';

interface Props {
    id: number;
    name: string;
    years_of_life: string;
    image_url: string;
    long_description?: string;
    isDetailed?: boolean;
}

export const DiscovererCard: FC<Props> = ({ id, name, years_of_life, image_url, long_description, isDetailed=false }) => {

    if (!id) {return null}
    return (
        <Card className="card" style={{padding: '0', margin: '0'}}>
            <p className='textName'>ИССЛЕДОВАТЕЛЬ</p>
        <Card.Img className="cardImage" variant="top" src={image_url || defaul}  />
        <Card.Body className="card-body">            
            <div className="titleStyle">
                <Card.Title>{name}</Card.Title>
            </div>

            <div className="textStyle">
                <Card.Text>
                    {years_of_life}
                </Card.Text>
            </div>
            {isDetailed && long_description && (
            <div className='aboba'>
                <Card.Text>
                    {long_description}
                </Card.Text>
            </div>
            )}
            <Button className="cardButton" variant="none" href={`${ROUTES.SERVICES}/${id}`}>Подробнее</Button>
        </Card.Body>
    </Card>
    );

};


