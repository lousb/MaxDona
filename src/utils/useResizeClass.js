import { debounce } from 'lodash';
import { useEffect } from 'react';

function useResizeClass() {
  useEffect(() => {
    const handleResizeStart = () => {
      document.body.classList.add('resizing');
    };

    const handleResizeEnd = debounce(() => {
      document.body.classList.remove('resizing');
    }, 150); // Adjust debounce delay as needed

    window.addEventListener('resize', handleResizeStart);
    window.addEventListener('resize', handleResizeEnd);

    // Cleanup listeners when component unmounts
    return () => {
      window.removeEventListener('resize', handleResizeStart);
      window.removeEventListener('resize', handleResizeEnd);
    };
  }, []);
}

export default useResizeClass;
