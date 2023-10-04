import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth(app);

  const handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const accepted = e.target.terms.checked;
    console.log(email, password, accepted);

    setErrorMessage("");
    setSuccessMessage("");

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[@#$%^&+=!]/.test(password);

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters or longer");
      return;
    } else if (!hasUpperCase) {
      setErrorMessage("Password must contain at least one upper case letter");
      return;
    } else if (!hasLowerCase) {
      setErrorMessage("Password must contain at least one lower case letter");
      return;
    } else if (!hasDigit) {
      setErrorMessage("Password must contain at least one digit");
      return;
    } else if (!hasSpecialChar) {
      setErrorMessage("Password must contain at least one special character");
      return;
    } else if (!accepted) {
      return setErrorMessage("Please accept out terms and conditions");
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result?.user);
        sendEmailVerification(auth.currentUser).then(() => {
          return alert("Please check your email and verify it");
        });
        setSuccessMessage("You have successfully registered");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="flex justify-center">
      <div className="border w-1/3 rounded-xl p-4">
        <h2 className="text-3xl text-center mb-8 font-bold mt-4">
          Please Register
        </h2>
        <form onSubmit={handleRegister}>
          <input
            className="px-10 w-full py-2 rounded-lg"
            type="email"
            name="email"
            id=""
            placeholder="Enter your Email"
            required
          />
          <br />
          <div className="relative">
            <input
              className="px-10 w-full py-2 rounded-lg mt-4 mb-4"
              type={showPassword ? "text" : "password"}
              name="password"
              id=""
              placeholder="Password"
              required
            />
            <span
              className="cursor-pointer absolute bottom-[37%] right-[2%]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
            </span>
          </div>
          <div className="mb-2">
            <input type="checkbox" name="terms" id="terms" />
            <label className="ml-2" htmlFor="terms">
              {" "}
              Accept our Terms & Conditions
            </label>
          </div>

          <input
            className="w-full py-2 btn-secondary font-bold text-xl rounded-lg cursor-pointer text-center "
            type="submit"
            value="Register"
          />
        </form>
        <p>
          Already have an account.{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Register;
