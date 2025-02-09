import { FC } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import "./InputField.css";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Col } from "react-bootstrap"
import favoriteImg from '../components/cart-icon.png'
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../Routes";

interface Props {
  value: string;
  setValue: (value: string) => void;
  loading?: boolean;
  onSubmit: () => void;
  placeholder?: string;
  buttonTitle?: string;
}

const InputField: FC<Props> = ({ value, setValue, loading, onSubmit, placeholder, buttonTitle }) => {

    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const id = useSelector((state: RootState) => state.discovery.draft_id);
    const count = useSelector((state: RootState) => state.discovery.draft_count);
    const navigate = useNavigate();
    


    const handleClick = (id: number | null) => {
      if (id) {
          navigate(`${ROUTES.DISCOVERY}/${id}`);
      } else {
          console.warn("Попытка навигации без ID!");
      }
  };
  
  console.log(`Navigate to: ${ROUTES.DISCOVERY}/${id ?? ''}`);
  
 
  return (
    <div className="inputField">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <Button onClick={onSubmit} disabled={loading}>
        {buttonTitle}
      </Button>

      <Col xs={2} sm={2} md={2}>
            <Button 
              className="btn-favorites position-relative" 
              onClick={() => handleClick(id ? id : null)} 
              disabled={!isAuthenticated || !id}
            >
              <img src={favoriteImg} alt="Избранное" />
              
              {/* Отображение count только если пользователь аутентифицирован и есть id */}
              {(isAuthenticated && id) && (
                <span 
                  className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle"
                >
                  {count}
                </span>
              )}
            </Button>
          </Col>

    </div>
  );
};

export default InputField;
