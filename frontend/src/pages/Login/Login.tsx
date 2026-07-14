import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../../auth/auth.service";

export const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Bienvenido al Sistema</h2>
        <button onClick={handleGoogleLogin} className="btn-google">
          Ingresar con Google 🚀
        </button>
      </div>
    </div>
  );
};
