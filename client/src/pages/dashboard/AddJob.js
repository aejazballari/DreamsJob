import { useAppContext } from "../../components/context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { FormRow, Alert, FormRowSelect } from "../../components";

const AddJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleInputChange,
    clearValues,
    createJob,
    editJob,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }
    if (isEditing) {
      editJob();
      return;
    }
    createJob();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleInputChange(name, value);
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "edit job" : "add job"} </h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            labelText="Job Location"
            name="jobLocation"
            value={jobLocation}
            handleChange={handleChange}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            value={jobType}
            list={jobTypeOptions}
            handleChange={handleChange}
          />
          <FormRowSelect
            name="status"
            value={status}
            list={statusOptions}
            handleChange={handleChange}
          />

          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};
export default AddJob;
