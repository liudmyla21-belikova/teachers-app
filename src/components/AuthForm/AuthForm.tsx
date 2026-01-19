import css from "./AuthForm.module.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FirebaseError } from "firebase/app";
import { registerUser } from "../../services/auth";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

interface AuthFormValues {
  name: string;
  email: string;
  password: string;
}

const authSchema = yup.object({
  name: yup.string().min(2, "Too short name").required("Name is required"),
  email: yup.string().email("Wrong email format").required("Email is required"),
  password: yup.string().min(6, "Too short").required("Password is required"),
});

type Props = {
  onClose: () => void;
};

export default function AuthForm({ onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      await registerUser(data.email, data.password);
      iziToast.success({
        title: "Success",
        message: "Registration successful! Welcome to LearnLingo.",
        position: "topRight",
      });
      onClose();
      console.log(data);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            iziToast.error({
              title: "Error",
              message: "User with this email is not registered.",
              position: "topRight",
            });
            break;
          case "auth/wrong-password":
            iziToast.error({
              title: "Error",
              message: "Incorrect password. Please try again.",
              position: "topRight",
            });
            break;
          case "auth/invalid-credential":
          case "auth/invalid-email":
            iziToast.error({
              title: "Error",
              message: "Invalid email or password.",
              position: "topRight",
            });
            break;
          default:
            iziToast.error({
              title: "Error",
              message: error.message,
              position: "topRight",
            });
        }
      } else {
        iziToast.error({
          title: "Error",
          message: "Something went wrong. Please try again later.",
          position: "topRight",
        });
      }
    }
  };

  return (
    <div className={css.authForm}>
      <h2>Registration</h2>
      <p>
        Thank you for your interest in our platform! In order to register, we
        need some information. Please provide us with the following information
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <input type="text" placeholder="Name" {...register("name")} />
        {errors.name && <span>{errors.name?.message}</span>}

        <input type="email" placeholder="Email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && <span>{errors.password.message}</span>}

        <button type="submit" className={css.btn}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
