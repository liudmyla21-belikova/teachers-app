import { PuffLoader } from "react-spinners";
import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loader}>
      <PuffLoader color="#E0A39A" size={60} />
    </div>
  );
}
