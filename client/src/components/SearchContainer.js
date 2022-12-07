import { useState, useMemo } from "react";
import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "./context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";

const SearchContainer = () => {
  const [localState, setLocalState] = useState("");
  const {
    isLoading,
    searchStatus,
    searchType,
    handleInputChange,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    clearFilters,
  } = useAppContext();

  const handleChange = (e) => {
    if (isLoading) return;
    handleInputChange(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters();
  };

  const debounce = () => {
    let timoutId;
    return (e) => {
      setLocalState(e.target.value);
      clearTimeout(timoutId);
      timoutId = setTimeout(() => {
        handleInputChange(e.target.name, e.target.value);
      }, 1000);
    };
  };

  const optimizedDebounce = useMemo(
    () => debounce(),
    // eslint-disable-next-line
    []
  );
  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={localState}
            handleChange={optimizedDebounce}
          />
          <FormRowSelect
            labelText="status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleChange}
            list={["all", ...statusOptions]}
          />
          <FormRowSelect
            labelText="type"
            name="searchType"
            value={searchType}
            handleChange={handleChange}
            list={["all", ...jobTypeOptions]}
          />
          <FormRowSelect
            labelText="sort"
            name="sort"
            value={sort}
            handleChange={handleChange}
            list={sortOptions}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
export default SearchContainer;
