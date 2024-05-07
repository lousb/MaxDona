import { createContext, useContext, useReducer } from "react";

// Define the initial state for the footer
const INITIAL_STATE = {
  default: true,
};

// Create a context for the footer
export const FooterContext = createContext(INITIAL_STATE);

// Define a reducer function to handle changes in the footer mode
const footerReducer = (state, action) => {
  switch (action.type) {
    case "Small":
      return {
        default: false,
      };
    case "Default":
      return {
        default: true,
      };
    case "TOGGLE":
      return {
        default: !state.default,
      };
    default:
      return state;
  }
};

// Create a custom hook to access the footer context and dispatch actions
export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error("useFooter must be used within a FooterContextProvider");
  }
  return context;
};

// Export the FooterContextProvider component
export const FooterContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(footerReducer, INITIAL_STATE);

  return (
    <FooterContext.Provider value={{ state, dispatch }}>
      {children}
    </FooterContext.Provider>
  );
};
