import { formatDistanceToNow } from "date-fns";

const FormattedRelativeTime = () => {
    const pastDate = new Date(new Date().getTime() - 10 * 60000); // 10 minutes ago
    const formattedRelativeTime = formatDistanceToNow(pastDate, { addSuffix: true });
    return formattedRelativeTime;
  };



  export default FormattedRelativeTime;