import "./allProjects.css";
import { useEffect, useState } from "react";
import { useFooter } from '../../../context/FooterContext';
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../../../firebase/firebase';
import { Link } from "react-router-dom";




const AllProjects = () => {
  const { dispatch } = useFooter();

  useEffect(() => {
    // Update the footer state when the component is mounted
    dispatch({ type: "Small" });

    // Clean up the state when the component is unmounted
    return () => {
      dispatch({ type: "Default" });
    };
  }, [dispatch]);

  return (
    <div className="all-projects-page-wrap">
      <div className="top-bar">
        {/* Add top-bar content if needed */}
      </div>
      <div className="all-projects-content">
        <ProjectList title='portfolio' />
        <ProjectList title='reference peace' />
      </div>
    </div>
  );
};

const ProjectList = ({ title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapShot) => {
      let list = [];
      snapShot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setData(list);
    }, (error) => {
      console.log(error);
    });

    return () => {
      unsub();
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };




  return (
    <div className={`ap-${title}-list all-projects-list`}>
      <div className="all-projects-list-title">
        <h2>{title}</h2>
        <Link to="/projects/new" title={title} className="add-project"></Link>
      </div>

      <div className={`${title}-list-wrap list-wrap`}>
        {data.map((project) => (
          <div className={`${title}-list-item list-item`} key={project.id}>
            <div className={`${title}-list-item-title list-item-title body`}>
              {project.displayName}
            </div>
            <div className={`${title}-${project.displayName}-actions list-item-actions`}>
              <Link to={`/projects/${project.id}`} className="view-list-item-link">
                <div className={`view-list-item`}></div>
              </Link>
              <Link to={`/projects/update/${project.id}`} state={{ id: project.id }} className="edit-list-item-link">
                <div className={`edit-list-item`}></div>
              </Link>
              <div className={`delete-list-item`} onClick={() => handleDelete(project.id)}>
                {/* Rest of the code remains the same */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
