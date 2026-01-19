import css from "./LoginForm.module.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FirebaseError } from "firebase/app";
import { loginUser } from "../../services/auth";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup.string().email("Wrong email format").required("Email is required"),
  password: yup.string().min(6, "Too short").required("Password is required"),
});

type Props = {
  onClose: () => void;
};

export default function LoginForm({ onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginUser(data.email, data.password);
      iziToast.success({
        title: "Success",
        message: "Welcome back! You have successfully logged in.",
        position: "topRight",
      });
      onClose();
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
    <div className={css.loginForm}>
      <h2>Log In</h2>

      <p>
        Welcome back! Please enter your credentials to access your account and
        continue your search for a teacher.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <input type="email" placeholder="Email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && <span>{errors.password.message}</span>}

        <button type="submit" className={css.btn}>
          Log in
        </button>
      </form>
    </div>
  );
}
