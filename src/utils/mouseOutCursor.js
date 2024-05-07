// useMouseLeave.js

const useMouseLeave = () => {
  const arrowCursor = document.querySelector('.large-arrow-cursor');

  const handleMouseLeave = () => {
    if (arrowCursor) {
      arrowCursor.classList.add('mouse-out');
    }
  };
  
  const handleMouseEnter = () => {
    if (arrowCursor) {
      arrowCursor.classList.remove('mouse-out');
    }
  };
  
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('mouseenter', handleMouseEnter);
  
};

export default useMouseLeave;
