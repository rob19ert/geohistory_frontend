
import { Navbar, Nav, Container } from 'react-bootstrap';
import { ROUTES } from '../Routes';

const Header = () => {
  const headerStyle = {
    width: '100%',
    height: '54px',
    background: '#607848',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '20px',
    paddingRight: '20px',
    color: 'white',
  };

  return (
    <Navbar style={headerStyle}>
      <Container fluid style={{ display: 'flex', flexDirection: 'row', margin: '0px'}}>
        {/* Логотип или название сайта */}
        <Navbar.Brand href={`${ROUTES.HOME}`} style={{
          fontWeight: '700',
          fontSize: '24px',
          color: '#fff'
        }}>Домой</Navbar.Brand>
        
        {/* Навигация (ссылки) */}
        <Nav className="ml-auto"> {/* Используем ml-auto для отступа справа */}
            {
              <Nav.Link href={`${ROUTES.SERVICES}`} style={{
                fontWeight: '700',
                fontSize: '18px',
                color: '#fff'
              }}>Услуги</Nav.Link>
            // <Nav.Link href="#pricing">Заявки</Nav.Link>
            }
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;