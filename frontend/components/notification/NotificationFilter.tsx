import { Select } from '@chakra-ui/react';

const NotificationFilter = ({ filter, setFilter }) => {
  return (
    <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
      <option value="all">All Notifications</option>
      <option value="episode">Episode Interactions</option>
      <option value="user">User Notifications</option>
    </Select>
  );
};

export default NotificationFilter;
