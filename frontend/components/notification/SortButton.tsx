import { Button } from '@chakra-ui/react';

const SortButton = ({ sortByDate, setSortByDate }) => {
  return (
    <Button onClick={() => setSortByDate(!sortByDate)}>
      Sort by {sortByDate ? 'Oldest' : 'Newest'}
    </Button>
  );
};

export default SortButton;
