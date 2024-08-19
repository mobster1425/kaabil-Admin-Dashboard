import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

function QuestionCrudDetails(props) {
	const [crud, setCrud] = useState(null);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
	const [maxId, setMaxId] = useState(null);
	const { questionId } = useParams();
	console.log("params =",questionId)
	//const navigate = useNavigate();



	const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [questionResponse, allQuestionsResponse] = await Promise.all([
			// https://admin.kaabil.me
       //   axios.get(`http://localhost:3001/api/question/${questionId}`),
       //   axios.get('http://localhost:3001/api/questions')


		  axios.get(`https://admin.kaabil.me/api/question/${questionId}`),
          axios.get('https://admin.kaabil.me/api/questions')
        ]);

        setCrud(questionResponse.data);
        setMaxId(Math.max(...allQuestionsResponse.data.map(q => q.questionId)));
      } catch (error) {
        console.log("error", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [questionId]);

	/*
	useEffect(
		function () {
			async function getCrudById() {
				try {
					setLoading(true);
					const response = await axios.get(`http://localhost:3001/api/question/${questionId}`);
					console.log("response from crud details is =",response)
					setCrud(response.data);
				} catch (error) {
					console.log("error", error);
					setError("An error occurred while fetching data.");
				}finally {
					setLoading(false);
				}
			}
			getCrudById();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[questionId]
	);

	async function handleDelete() {
		try {
			await axios.delete(`/api/cruds/${_id}`);
			navigate("/cruds");
		} catch (error) {
			console.error(error);
		}
	}
    */


	const handlePrevious = () => {
		const prevId = parseInt(questionId) - 1;
		if (prevId > 0) {
		  navigate(`/questions/${prevId}`);
		}
	  };



	  const handleNext = () => {
		const nextId = parseInt(questionId) + 1;
		// if (nextId <= maxId) {
		  navigate(`/questions/${nextId}`);
	//	}
	  };

	
	  const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this question?")) {
		  try {
		//	await axios.delete(`http://localhost:3001/api/question/${questionId}`);
		await axios.delete(`https://admin.kaabil.me/api/question/${questionId}`);
			navigate("/questions");
		  } catch (error) {
			console.error("Error deleting question:", error);
			setError("An error occurred while deleting the question.");
		  }
		}
	  };

	useEffect(() => {
        console.log("Current crud state:", crud);
    }, [crud]);

	// Helper function to safely render potentially nested data
	const renderData = (data) => {
		if (data === undefined) return "N/A";
		if (typeof data === 'object' && data !== null) {
			return JSON.stringify(data);
		}
		return data;
	};


	if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!crud) return <div>No data found</div>;


// If crud is an array, take the first item
const crudData = Array.isArray(crud) ? crud[0] : crud;

	return (
		<div className="container">
			  <h2>Question Details (ID: {questionId})</h2>
<div>
<p><b>id</b>: {crudData.id}</p>
			<p><b>Question</b>: {renderData(crudData.question)}</p>
			<p><b>Options</b>: {renderData(crudData.options)}</p>
			<p><b>Solution</b>: {renderData(crudData.solution)}</p>
			<p><b>Level</b>: {renderData(crudData.level)}</p>
			<p><b>Question Type</b>: {renderData(crudData.question_type)}</p>
			<p><b>Reference</b>: {renderData(crudData.reference)}</p>
			<p><b>Comprehension Question</b>: {renderData(crudData.comprehension_question)}</p>
            <p><b>Answer</b>: {renderData(crudData.answer)}</p>
            <p><b>Course Name</b>: {renderData(crudData.Course.courseName)}</p>
            <p><b>Lesson Id</b>: {renderData(crudData.LessonId)}</p>
			


			<div className="btn-group mt-3">
          <button onClick={handlePrevious} className="btn btn-secondary" disabled={questionId <= 1}>
            Previous
          </button>
          <button onClick={handleNext} className="btn btn-secondary" disabled={questionId >= maxId}>
            Next
          </button>
          <Link to={`/questions/edit/${questionId}`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
          <Link to="/questions" className="btn btn-secondary">
            Close
          </Link>
        </div>
			<hr />
			</div>
		</div>
	);
}

export default QuestionCrudDetails;