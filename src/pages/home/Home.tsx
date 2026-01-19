import { useNavigate } from "react-router-dom";
import css from "./Home.module.css";


export default function Home() {
  const navigate = useNavigate();

  const handleGoToTeachersPage = () => {
    navigate("/teachers");
  };

  return (
    <section className={css.home}>
      <div className={css.homeContainer}>
        <div className={css.homeBox}>
          <div className={css.homeBoxDiv1}>
            <h1>
              Unlock your potential with the best <span>language</span> tutors
            </h1>

            <p>
              Embark on an Exciting Language Journey with Expert Language <br/>
              Tutors: Elevate your language proficiency to new heights by connecting
              with highly qualified and experienced tutors.
            </p>

            <div>
              <button
                type="button"
                className={css.btn}
                onClick={handleGoToTeachersPage}
              >
                Get started
              </button>
            </div>
          </div>

          <div className={css.homeBoxDiv2}>
            <img src="/block.png" alt="Language learning" />
          </div>
        </div>

        <div className={css.homeWrapper}>
          <ul>
            <li>
              <span>32,000+</span>
              <p>Experienced tutors</p>
            </li>
            <li>
              <span>300,000+</span>
              <p>5-star tutor reviews</p>
            </li>
            <li>
              <span>120+</span>
              <p>Subjects taught</p>
            </li>
            <li>
              <span>200+</span>
              <p>Tutor nationalities</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}