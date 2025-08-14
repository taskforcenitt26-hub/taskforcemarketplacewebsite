import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    
    if (title) {
      document.title = `${title} | Cycle Marketplace`;
    } else {
      document.title = 'Cycle Marketplace - Premium Bicycles for Every Adventure';
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default usePageTitle;