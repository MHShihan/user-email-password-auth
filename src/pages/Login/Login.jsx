import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef();
  const auth = getAuth(app);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    // const accepted = e.target.terms.checked;
    console.log(email, password);

    setErrorMessage("");
    setSuccessMessage("");

    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result?.user);
        if (result?.user?.emailVerified) {
          return setSuccessMessage("You have successfully logged in");
        } else {
          return alert("Please verify your email address");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
      });
  };

  const handleForgetPassword = () => {
    const email = emailRef.current.value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    console.log("Forget Password", email);
    if (!email) {
      return alert("Please write an email");
    } else if (!emailRegex.test(email)) {
      return alert("Please provide an valid email");
    } else {
      console.log("This is an valid email");
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Please check your email");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error, errorCode, errorMessage);
      });
  };

  return (
    <div className="hero bg-base-200">
      <div className="hero-content w-1/2 flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleLogin} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                ref={emailRef}
                name="email"
                placeholder="email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  name="password"
                  className="input input-bordered w-full"
                  required
                />
                <span
                  className="cursor-pointer absolute bottom-[37%] right-[3%]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
                </span>
              </div>
              <label className="label">
                <a
                  onClick={handleForgetPassword}
                  href="#"
                  className="label-text-alt link link-hover"
                >
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
            <p>
              New to this website? Please{" "}
              <Link className="text-blue-600" to="/register">
                Register
              </Link>
            </p>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && (
              <p className="text-green-600">{successMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
