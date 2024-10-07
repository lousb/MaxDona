import React, { useState, useRef, useEffect } from "react";
import styles from './footer.module.css';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../../../../firebase/firebase';
import { Link } from "react-router-dom";
import DelayLink from "../../../../utils/delayLink";

function FooterDefault() {
    const [projects, setProjects] = useState([]);
    const [referencePeace, setReferencePeace] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);
    const MAX_INDEX = 10;

    useEffect(() => {
        const options = {
            threshold: 0.4 // Trigger when 40% of the footer is visible
        };

        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, options);

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);


    useEffect(() => {
        const unsubscribeProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
            const projectsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsList);
        });

        const unsubscribeReferencePeace = onSnapshot(collection(db, "referencePeace"), (snapshot) => {
            const referencePeaceList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setReferencePeace(referencePeaceList);
        });

        return () => {
            unsubscribeProjects();
            unsubscribeReferencePeace();
        };
    }, []);

    const groupByYear = (items) => {
        return items.reduce((acc, item) => {
            const year = new Date(item.releaseDate).getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(item);
            return acc;
        }, {});
    };

    const groupedProjects = groupByYear(projects);
    const groupedReferencePeace = groupByYear(referencePeace);

    const currentYear = new Date().getFullYear();

    return (
        <footer className={`${styles["footer"]} ${isVisible ? "visible" : ""}`} ref={footerRef}>
            <div className={styles["footer-wrap"]}>
                <div className={styles["footer-col-1"]}>
                    <div className={styles["footer-title"]}>
                            Find Me
                        </div>
                   
                    <div className={styles["country-wrap"]}>
                        <div className={styles["flag-wrap"]}>
                            <img className={styles["flag"]} src='/icons/Minimal-Aus.svg' alt="Australian Flag" />
                            <img className={styles["flag"]} src='/icons/Minimal-Indigenous.svg' alt="Indigenous Flag" />
                        </div>
                        <div className={styles["acknowledgement-of-country"]}>
                            I respectfully acknowledge the Gadigal people of the Eora Nation as the Traditional Custodians of the land I operate upon. I extend that respect to elders, both past, present & emerging.
                        </div>
                    </div>
                    <div className={styles["find-me-wrap"]}>
                        
                        <a className="primary-button">Instagram</a>
                        <a className="primary-button">Youtube</a>
                        <a className="primary-button">Contact</a>
                    </div>
                </div>
                <div className={styles["footer-col-2"]}></div>
                <div className={`${styles["footer-col-3"]} ${styles["footer-column"]}`}>
                    <div className={styles["footer-archive-div"]}  style={{padding : '0px'}}>ARCHIVE</div>
                    {Object.keys(groupedProjects)
                      .sort((a, b) => b - a) // Sort years in descending order
                      .map((year) => (
                        <div key={year}>
                          <div className={styles["footer-archive-div"]}>{year}</div>
                          {groupedProjects[year].slice(0, MAX_INDEX - 1).map((project) => (
                            <DelayLink key={project.id} delay={1500} to={`/projects/${project.id}`} className="primary-button">
                              {project.displayName}
                            </DelayLink>
                          ))}
                          
                        </div>
                        
                      ))
                      
                    }
                    <DelayLink delay={1500} to={`/reference-peace/`} className={`primary-button ${styles['footer-column-cta']}`}>
                    FULL ARCHIVE
                    </DelayLink>
                </div>
                <div className={`${styles["footer-col-4"]} ${styles["footer-column"]}`}>
                {Object.keys(groupedReferencePeace).map((year) => (
                      <div key={year}>
                        <div className={styles["footer-archive-div"]} style={{ padding: '0px' }}>REFERENCE PEACE</div>
                        <div className={styles["footer-archive-div"]}>{year}</div>
                        {groupedReferencePeace[year].slice(0, MAX_INDEX - 1).map((item) => (
                          <DelayLink key={item.id} delay={1500} to={`/reference-peace/${item.id}`} className="primary-button">
                            {item.displayName}
                          </DelayLink>
                        ))}
                      </div>
                    ))}
                    <DelayLink delay={1500} to={`/reference-peace/`} className={`primary-button ${styles['footer-column-cta']}`}>
                      Reference Peace
                    </DelayLink>
                </div>
            </div>
            <div className={styles["bottom-footer-area"]}>
                <div className={styles["footer-col-1"]}>
                    <div className={styles["footer-logo"]}>
                        <a className='footer-logo-link' href='/'>
                            <img className="footer-logo" src="/LOGO-DESKTOP.svg" alt="Logo" />
                        </a>
                    </div>
                </div>
                <div className={styles["footer-col-2"]}>
                    <div className={styles["acknowledgement-of-country"]}>
                        Max Dona © {currentYear}<br />
                        <a href="https://wyeeeth.com" target="_blank" rel="noopener noreferrer">A Wyeeeth Site</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterDefault;
