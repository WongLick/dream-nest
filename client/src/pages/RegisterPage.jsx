import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  console.log(formData);

  const [passwordMatch, setPasswordMatch] = useState(false);

  useEffect(()=> {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
  })

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const register_form = new FormData();
      for (var key in formData) {
        register_form.append(key, formData[key]);
      }
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: register_form,
      });

      if (response.ok) {
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration failed", err.message);
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <form
          action=""
          className="register_content_form"
          onSubmit={handleSubmit}
        >
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email@email.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          <input
            type="file"
            name="profileImage"
            id="image"
            required
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="Add Profile Image" />
            <p>Upload Your Image</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile image"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch}>
            REGISTER
          </button>
        </form>
        <a href="">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
