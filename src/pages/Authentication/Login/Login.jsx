import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const { signIN } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    signIN(data.email, data.password)
    .then(result=>{
      console.log(result.user)
      navigate(from)
    })
    .catch(error=>{
      console.error(error)
    })
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input"
            placeholder="Email"
          />
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500"> Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500"> Password is must be 6</p>
          )}
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-primary text-black mt-4">Login</button>
        </fieldset>
        <p>
          <small>
            new to website?
            <Link className="link link-info" to="/register">
              register
            </Link>
          </small>
        </p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Login;
