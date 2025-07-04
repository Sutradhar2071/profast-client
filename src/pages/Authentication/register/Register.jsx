import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState("");

  const axiosInstance = useAxios();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);
        // profile update by database

        const userInfo = {
          email: data.email,
          role: "user", // default role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const userRes = await axiosInstance.post("/users", userInfo);
        console.log("profile update ", userRes);

        // update profile by firebase

        const userProfile = {
          displayName: data.name,
          photoURL: profile,
        };

        updateUserProfile(userProfile)
          .then(() => {
            console.log("catch pic");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImgButton = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    const formdata = new FormData();
    formdata.append("image", image);

    const imgURL = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMAGE_KEY
    }`;

    const res = await axios.post(imgURL, formdata);
    setProfile(res.data.data.url);
  };

  return (
    <div className="hero-content flex-col lg:flex-row-reverse">
      <div className="text-center lg:text-left"></div>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <h1 className="text-5xl font-bold">Create now!</h1>
              {/* Name field */}
              <label className="label">Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="input"
                placeholder="Email"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500">Name is Required</p>
              )}
              {/* img field */}
              <label className="label">Img</label>
              <input
                onChange={handleImgButton}
                type="file"
                className="file"
                placeholder="img"
              />
              {/* email field */}
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input"
                placeholder="Email"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500">Email is Required</p>
              )}

              {/* password field */}
              <label className="label">Password</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="input"
                placeholder="Password"
              />
              <div>
                {errors.password?.type === "required" && (
                  <p className="text-red-500">Password is Required</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-500">Pass must be 6</p>
                )}
                <a className="link link-hover">Forgot password?</a>
              </div>
              <button className="btn btn-primary text-black mt-4">Login</button>
            </fieldset>
            <p>
              <small>
                Already have an account?
                <Link className="link link-info" to="/login">
                  Login
                </Link>
              </small>
            </p>
          </form>
          <SocialLogin></SocialLogin>
        </div>
      </div>
    </div>
  );
};

export default Register;
