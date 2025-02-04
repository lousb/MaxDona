import "./allProjects.css";
import React, { useEffect, useState } from "react";
import { useFooter } from '../../../context/FooterContext';
import { collection, deleteDoc, doc, onSnapshot, updateDoc, query, where, getDocs, orderBy, writeBatch, limit, addDoc, setDoc } from "firebase/firestore";
import { db } from '../../../firebase/firebase';
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Reveal from "../../../utils/textElementReveal/textElementReveal";
import { motion, AnimatePresence } from "framer-motion";

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
        <ProjectList title='featured' featured={true} />
      </div>
    </div>
  );
};



const ProjectList = ({ title, featured }) => {
  const [data, setData] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    let unsubFeatured;
    if (featured) {
      unsubFeatured = onSnapshot(
        query(collection(db, "projects"), where("isFeatured", "==", true), orderBy("featuredIndex")),
        (snapShot) => {
          let featuredList = [];
          snapShot.docs.forEach((doc) => {
            featuredList.push({ id: doc.id, ...doc.data() });
          });
          setFeaturedData(featuredList);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    return () => {
      if (unsubFeatured) {
        unsubFeatured();
      }
    };
  }, [featured]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return; // No valid drop target

    const items = Array.from(featuredData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order in Firestore
    try {
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        const projectRef = doc(db, "projects", item.id);
        batch.update(projectRef, { featuredIndex: index });
      });
      await batch.commit();
      setFeaturedData(items);
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };
  
  




  useEffect(() => {
    if (!featured) {
      let collectionName = title === 'reference peace' ? 'referencePeace' : 'projects';

      let unsub = onSnapshot(collection(db, collectionName), (snapShot) => {
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
    }
  }, [title, featured]);

  const handleDelete = async (id, type) => {
    try {
      if(type === 1){
        await deleteDoc(doc(db, "projects", id));
      } else if (type === 2){
        await deleteDoc(doc(db, "referencePeace", id));
      }
      
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

const handleSetFeatured = async (id, isCurrentlyFeatured) => {
  try {
    if (isCurrentlyFeatured) {
      await updateDoc(doc(db, "projects", id), {
        isFeatured: false,
        featuredIndex: null
      });
      console.log(`Project ${id} is no longer featured`);
    } else {
      // Get the current highest index value
      const q = query(collection(db, "projects"), where("isFeatured", "==", true), orderBy("featuredIndex", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      let newIndex = 0;
      if (!querySnapshot.empty) {
        const highestIndexedDoc = querySnapshot.docs[0];
        newIndex = highestIndexedDoc.data().featuredIndex + 1;
      }

      await updateDoc(doc(db, "projects", id), {
        isFeatured: true,
        featuredIndex: newIndex
      });
      console.log(`Project ${id} is now featured with index ${newIndex}`);
    }
  } catch (err) {
    console.log(`Error updating project ${id}:`, err);
  }
};
  
  
  
  const handleRemoveFeatured = async (id) => {
    try {
      await updateDoc(doc(db, "projects", id), {
        isFeatured: false,
        featuredIndex: null
      });
    } catch (err) {
      console.log(err);
    }
  };

  

  const handleDuplicate = async (project, title) => {
      try {
        // Determine the collection name based on the project title
        let collectionName;

        if (title === 'portfolio') {
          collectionName = "projects"; // Set collection for portfolio
        } else if (title === 'reference peace') {
          collectionName = "referencePeace"; // Set collection for reference peace
        } else {
          console.error("Project title not recognized: ", title);
          return; // Early exit if title doesn't match
        }

        // Get the current count of documents in the collection
        const snapshot = await getDocs(collection(db, collectionName));
        const currentCount = snapshot.docs.length; // Count existing documents

        // Create a new display name and ID based on the count
        const newIndex = currentCount + 1; // Increment the count for the new item
        const newDisplayName = newIndex < 10 ? `VOLUME0${newIndex}` : `VOLUME${newIndex}`;

        const newProject = {
          ...project,
          isActive: true, // Set the duplicated project as active
          displayName: newDisplayName, // Use the generated display name
        };

        // Use setDoc to set a custom document ID
        const docRef = await setDoc(doc(db, collectionName, newDisplayName), {
          ...newProject,
          id: newDisplayName // Explicitly set the document ID
        });

        console.log("Duplicated project added with custom ID: ", newDisplayName);
      } catch (err) {
        console.error("Error duplicating project: ", err);
      }
  };


const handleDeleteConfirm = async () => {
  if (projectToDelete) {
    try {
      if (title === 'portfolio') {
        await deleteDoc(doc(db, "projects", projectToDelete));
      } else if (title === 'reference peace') {
        await deleteDoc(doc(db, "referencePeace", projectToDelete));
      }
      setData(data.filter((item) => item.id !== projectToDelete));
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeleteModalOpen(false); // Close the modal
      setProjectToDelete(null); // Reset the project to delete
    }
  }
};

  
  

  return (
    <div className={`ap-${title}-list all-projects-list`}>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        projectToDelete={projectToDelete}
      />
      <div className="all-projects-list-title">
        <h2>{title}</h2>
        {title === 'reference peace' ?  <Link to="/projects/referencepeace/new" title={title} className="add-project"></Link> : featured ? '' : <Link to="/projects/new" title={title} className="add-project"></Link>}
      </div>
  
      <div className={`${title}-list-wrap list-wrap`}>
        {featured ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className={`${title}-list-wrap list-wrap`}>
                  {featuredData.map((project, index) => (
                    <React.Fragment key={index}>
                    <Draggable key={project.id} draggableId={project.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`${title}-list-item list-item`}
                        >
                          <div className={`${title}-list-item-title list-item-title body`}>
                            {project.displayName}
                          </div>
                          <div className={`${title}-${project.displayName}-actions list-item-actions`}>
                          <Link to={`/archive/${project.id}`} className="view-list-item-link">
                              <div className={`view-list-item`}></div>
                            </Link>
                            <div className="remove-featured-button" onClick={() => handleRemoveFeatured(project.id)}>
                              <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.2147 1.87812C11.3045 1.60172 11.6955 1.60172 11.7853 1.87812L14.0146 8.73901C14.0547 8.86262 14.1699 8.9463 14.2999 8.9463H21.5138C21.8045 8.9463 21.9253 9.31819 21.6902 9.48901L15.854 13.7293C15.7488 13.8057 15.7048 13.9411 15.745 14.0647L17.9742 20.9256C18.064 21.202 17.7477 21.4318 17.5126 21.261L11.6763 17.0207C11.5712 16.9443 11.4288 16.9443 11.3237 17.0207L5.48744 21.261C5.25233 21.4318 4.93598 21.202 5.02579 20.9256L7.25503 14.0647C7.29519 13.9411 7.25119 13.8057 7.14604 13.7293L1.30982 9.48901C1.07471 9.31819 1.19554 8.9463 1.48616 8.9463H8.70013C8.83009 8.9463 8.94528 8.86262 8.98544 8.73901L11.2147 1.87812Z" stroke="black" strokeWidth="1.6" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                    </React.Fragment>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          data.map((project) => (
            <div className={`${title}-list-item list-item`} key={project.id}>
              <div className={`${title}-list-item-title list-item-title body`}>
                {project.displayName}
              </div>
              <div className={`${title}-${project.displayName}-actions list-item-actions`}>
                <Link to={`/${title === 'reference peace'?'reference-peace':'archive'}/${project.id}`} className="view-list-item-link">
                  <div className={`view-list-item`}></div>
                </Link>
                <Link to={`/projects/update/${project.id}`} state={{ id: project.id }} className="edit-list-item-link">
                  <div className={`edit-list-item`}></div>
                </Link>
                {/* <button onClick={() => handleDuplicate(project, title)}>Duplicate</button> */}
                {title !== 'reference peace'?
                  <div className={`delete-list-item`} 
                  onClick={() => {
                    setProjectToDelete(project.id, 1); // Set the project ID to delete
                    setIsDeleteModalOpen(true); // Open the modal
                  }}
                  ></div>
                :
                  <div className={`delete-list-item`} 
                  onClick={() => {
                    setProjectToDelete(project.id, 2); // Set the project ID to delete
                    setIsDeleteModalOpen(true); // Open the modal
                  }}
                  ></div>
                }
                {title !== 'reference peace' && (
                  <div className={`add-featured-button ${project.isFeatured && 'featured-active'}`} onClick={() => handleSetFeatured(project.id, project.isFeatured)}>
                    <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.2147 1.87812C11.3045 1.60172 11.6955 1.60172 11.7853 1.87812L14.0146 8.73901C14.0547 8.86262 14.1699 8.9463 14.2999 8.9463H21.5138C21.8045 8.9463 21.9253 9.31819 21.6902 9.48901L15.854 13.7293C15.7488 13.8057 15.7048 13.9411 15.745 14.0647L17.9742 20.9256C18.064 21.202 17.7477 21.4318 17.5126 21.261L11.6763 17.0207C11.5712 16.9443 11.4288 16.9443 11.3237 17.0207L5.48744 21.261C5.25233 21.4318 4.93598 21.202 5.02579 20.9256L7.25503 14.0647C7.29519 13.9411 7.25119 13.8057 7.14604 13.7293L1.30982 9.48901C1.07471 9.31819 1.19554 8.9463 1.48616 8.9463H8.70013C8.83009 8.9463 8.94528 8.86262 8.98544 8.73901L11.2147 1.87812Z" stroke="black" strokeWidth="1.6" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};  



const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, projectToDelete }) => {
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="delete-modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="delete-modal-content"
            onClick={handleContentClick}
            initial={{ clipPath: "inset(0 0 100% 0 round 10px);" }} // Start fully hidden
            animate={{ clipPath: "inset(0% 0 0 0 round 10px)" }} // Reveal fully
            exit={{ clipPath: "inset(100% 0 0 0 round 10px)" }} // Hide again
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          >
            <h2>Are you sure you want to delete this project?</h2>
            <Reveal textContent={projectToDelete} element={"span"} elementClass={"body"} />
            <div className="delete-modal-actions">
              <button onClick={onConfirm} className="body delete-action">
                Bun it
              </button>
              <button onClick={onClose} className="body cancel-action">
                No
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AllProjects;
