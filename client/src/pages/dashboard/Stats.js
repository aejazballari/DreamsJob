import { useEffect } from "react";
import { useAppContext } from "../../components/context/appContext";
import { StatsContainer, Loading, ChartsContainer } from "../../components";

const Stats = () => {
  const { showStats, isLoading, monthlyApplication } = useAppContext();
  useEffect(() => {
    showStats();
    // eslint-disable-next-line
  }, []);
  console.log(monthlyApplication);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <StatsContainer />
      {monthlyApplication?.length > 0 && <ChartsContainer />}
    </div>
  );
};
export default Stats;
