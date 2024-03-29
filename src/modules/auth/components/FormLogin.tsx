import { Checkbox, Input, Form, Alert, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fontLabelComponent } from "../styles/stylesAuth";
import { IndexAuth, authLogin } from "../function/index.auth";
import FormRegisterUser from "./FormRegisterUser";
import Swal from "sweetalert2";

const FormLogin = () => {
  const [type, setType] = useState(0);
  const [text_pass, setText_pass] = useState("password");
  const history = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const [onClickSession, setOnClickSession] = useState<boolean>(false);
  const [typeRes, setTypeRes] = useState<any>("");
  const [message, setMessage] = useState<string>("");

  /* Una función que devuelve un componente de alerta. */
  const getAlertMessage = () => {
    return (
      <div className="container-alert-login">
        <Alert
          message={message}
          type={typeRes}
          style={{ marginTop: 10 }}
          showIcon
          closable
        />
        <br />
      </div>
    );
  };

  const signIn = async() => {
  try {
    const res = await authLogin(userName,password)
    if (userName == "" && password == "") {
      setAlert(true);
      setTypeRes("error");
      setMessage("Acción no permitida, Debe ingresar todos los campos");
      return;
    }

    if (res?.token) {
      IndexAuth(userName, password);
      setOnClickSession(true);
      history("/savia/home");
      return;
    }

    setAlert(true);
    setTypeRes("error");
    setMessage("Credenciales incorrectas");
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: `<div><div><span style='font-size:40px'>Error de autenticación</span></div><p/><div><span style='font-size:18px'>usuario o contraseña incorrectos por favor valide e intente nuevamente</span></div><hr/></div>`,
      showConfirmButton:true,
      confirmButtonText:"Aceptar",
      width:600,
      confirmButtonColor:"#244C5C",
      customClass:{
        confirmButton:"btn btn-primary",
      }
    })  }
   
  };

  return (
    <div>
      <Form>
        <div className="container-inputs-login usuario-item-login">
          <label
            htmlFor="user_id"
            className="form-label "
            style={fontLabelComponent(false)}
          >
            Digite su usuario
          </label>
          <Input
            type="text"
            className="form-control"
            id="user_id"
            name="user"
            autoComplete="off"
            style={fontLabelComponent(true)}
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
        </div>
        <br />
        <div className="container-inputs-login">
          <label
            htmlFor="password_id"
            className="form-label"
            style={fontLabelComponent(false)}
          >
            Digite su contraseña
          </label>
          <div className="input-group mb-3">
            <Input
              type={text_pass}
              className="form-control border-end-0 "
              id="password_id"
              name="password"
              autoComplete="on"
              style={fontLabelComponent(true)}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <span
              className="input-group-text bg-white border-start-0"
              style={{ cursor: "pointer", ...fontLabelComponent }}
              onClick={() => {
                setType(type === 0 ? 1 : 0);
                setText_pass(type === 0 ? "text" : "password");
              }}
            >
              {type === 0 && <span style={{ color: "#1FAEEF" }}>VER</span>}
              {type === 1 && <span style={{ color: "#1FAEEF" }}>OCULTAR</span>}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <label className="d-flex align-items-center fw-normal">
              <Checkbox onChange={() => {}} style={fontLabelComponent(true)}>
                Recordar datos de acceso
              </Checkbox>
            </label>
          </div>
          <div
           
            style={{marginTop:"5%"}}
          >
           
          </div>
        </div>
      
        <div className="row">
          <div className="col text-end">
            <button
              type="submit"
              style={{
                borderRadius: 18,
                width: "35%",
                backgroundColor: "#244c5c",
                marginBottom: 15,
                marginTop: 20,
              }}
              className="btn text-white"
              disabled={onClickSession}
              onClick={() => signIn()}
            >
              {onClickSession ? "Espere..." : "Ingresar"}
            </button>
          </div>
        </div>
        {alert ? getAlertMessage() : null}
      </Form>
    </div>
  );
};

export default FormLogin;
