import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Functional link component which delays page navigation
export const DelayLink = ({
  delay = 0,
  onDelayStart = () => {},
  onDelayEnd = () => {},
  replace = false,
  to,
  ...rest
}) => {
  let timeout = null;
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeout]);

  const handleClick = e => {
    // if trying to navigate to current page stop everything
    if (location?.pathname === to) return;

    onDelayStart(e, to);
    if (e.defaultPrevented) {
      return;
    }

    e.preventDefault();

    // Add the class when the delay starts
    document.body.classList.add("page-transitioning");

    timeout = setTimeout(() => {
      if (replace) {
        navigate(to, { replace: true });
      } else {
        navigate(to);
      }
      onDelayEnd(e, to);

      // Remove the class when the delay ends
      document.body.classList.remove("page-transitioning");

      // Dispatch the custom event after the navigation
      window.dispatchEvent(new Event('routeChange'));
    }, delay);
  };

  return <Link {...rest} to={to} onClick={handleClick} />;
};

DelayLink.propTypes = {
  // Milliseconds to wait before registering the click.
  delay: PropTypes.number,
  // Called after the link is clicked and before the delay timer starts.
  onDelayStart: PropTypes.func,
  // Called after the delay timer ends.
  onDelayEnd: PropTypes.func,
  // Replace history or not
  replace: PropTypes.bool,
  // Link to go to
  to: PropTypes.string.isRequired
};

export default DelayLink;
