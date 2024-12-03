import React, { useEffect } from 'react';
import styles from './pageNotFound.module.css';
import { useFooter } from '../../../context/FooterContext';
import SpaceInvaders from './spaceInvaders';

const NotFound = () => {

  const { dispatch } = useFooter();

  useEffect(() => {
      dispatch({ type: "Small" });
      return () => {
          dispatch({ type: "Default" });
      };
  }, [dispatch]);

  useEffect(()=>{
    document.title = `Page not found - Max Dona`;

    document.documentElement.style.setProperty('--primary-color', '#181818');
    document.documentElement.style.setProperty('--secondary-dark', 'rgb(10, 10, 10)');
  }, [])

  return (
    <div className={`${styles['page-not-found-wrap']}`}>
      <div className={`${styles['page-not-found-title-overlay']}`}>
      <div>
        <h3 className={`heading ${styles['page-not-found-heading']}`}>THATS CRAAAZY</h3>
        <p className={`body`}>This page doesn't exist </p>
      </div>

      {/* <h3 className={`title ${styles['page-not-found-title']}`}>404</h3>
      <p className={`body`}>This is due to be a very special page <br/> with unique functionality during production </p> */}

      </div>
      

      <SpaceInvaders/>
    </div>
  );
};

export default NotFound;