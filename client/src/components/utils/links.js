import { MdQueryStats } from "react-icons/md";
import { IoBarChartSharp } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

export const links = [
  {
    id: 1,
    text: "stats",
    path: "/",
    icon: <IoBarChartSharp />,
  },
  {
    id: 2,
    text: "all jobs",
    path: "all-jobs",
    icon: <MdQueryStats />,
  },
  {
    id: 3,
    text: "add job",
    path: "add-job",
    icon: <FaWpforms />,
  },
  {
    id: 34,
    text: "profile",
    path: "profile",
    icon: <ImProfile />,
  },
];
