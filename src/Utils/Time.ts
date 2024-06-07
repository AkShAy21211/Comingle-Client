import { formatDistance } from "date-fns";

const FormattedRelativeTime = (date:string) => {
   
    return formatDistance(date,new Date(),{addSuffix:true});
  };



  export default FormattedRelativeTime;