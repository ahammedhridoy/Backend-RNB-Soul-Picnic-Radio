import { useState } from "react";

const usePagination = (initialCount = 8, incrementCount = 8) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + incrementCount);
  };

  return { visibleCount, loadMore };
};

export default usePagination;
