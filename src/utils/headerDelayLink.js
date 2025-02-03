import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const DelayLink = ({ delay = 0, onDelayStart = () => {}, onDelayEnd = () => {}, to, ...rest }) => {
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleClick = (e) => {

    // If trying to navigate to current page, stop everything
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(to, window.location.origin);

    if (currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search && currentUrl.hash === targetUrl.hash) {
      return;
    }

    onDelayStart(e, to);
    if (e.defaultPrevented) {
      return;
    }

    e.preventDefault();

    // Add the class when the delay starts
    document.body.classList.add("page-transitioning");
    document.body.classList.add("header-transitioning");

    const id = setTimeout(() => {
      window.location.href = to;
      onDelayEnd(e, to);

      // Remove the class when the delay ends
      document.body.classList.remove("page-transitioning");
      document.body.classList.remove("header-transitioning");

      // Dispatch the custom event after the navigation
      window.dispatchEvent(new Event('routeChange'));
    }, delay);
    
    setTimeoutId(id);
  };

  return <a {...rest} href={to} onClick={handleClick} />;
};

DelayLink.propTypes = {
  delay: PropTypes.number,
  onDelayStart: PropTypes.func,
  onDelayEnd: PropTypes.func,
  to: PropTypes.string.isRequired,
};

export default DelayLink;
