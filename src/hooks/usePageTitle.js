import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const BRAND_TITLE = 'RECycle MarketPlace';
    document.title = BRAND_TITLE;
    // keep cleanup to avoid any external overrides lingering
    return () => { document.title = BRAND_TITLE; };
  }, [title]);
};

export default usePageTitle;