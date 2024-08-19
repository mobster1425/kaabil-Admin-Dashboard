import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function QuestionCrudTable() {
	const [cruds, setCruds] = useState([]);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(function () {
		async function getCruds() {
			try {
				setLoading(true);
			//	https://admin.kaabil.me
			//	const response = await axios.get("http://localhost:3001/api/questions/");
			const response = await axios.get("https://admin.kaabil.me/api/questions/");
				console.log("response =",response)
				setCruds(response.data);
			} catch (error) {
				console.log("error", error);
				setError("An error occurred while fetching data.");
			}finally {
				setLoading(false);
			}
		}
		getCruds();
	}, []);

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this question?")) {
		  try {
		//	await axios.delete(`http://localhost:3001/api/question/${id}`);
		await axios.delete(`https://admin.kaabil.me/api/question/${id}`);
			setCruds(cruds.filter(crud => crud.id !== id));
		  } catch (error) {
			console.error("Error deleting question:", error);
			setError("An error occurred while deleting the question.");
		  }
		}
	  };
	
	// Helper function to safely render potentially nested data
	const renderData = (data) => {
		if (typeof data === 'object' && data !== null) {
			return JSON.stringify(data);
		}
		return data;
	};


	if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!cruds) return <div>No data found</div>;

	return (
		<div className="container">
			<div>
				<h2>
					Questions Table View
					
				</h2>
				<Link to="/questions/create" className="btn btn-primary mb-3">
          Create New Question
        </Link>
				<hr />
			</div>
		
                        <div className="table-responsive">
			<table className="table riped  table-hover table-bordered container">
				<thead>
					<tr>
                    <th>Id</th>
					<th>Question</th>
						<th>Options</th>
						<th>Solution</th>
						<th>Level</th>
						<th>Question Type</th>
						<th>Reference</th>
						<th>Comprehention Question</th>
						<th>Answer</th>
                        <th>Course Name</th>
                        <th>LessonId</th>
						
					</tr>
				</thead>
				<tbody>
					{cruds &&
						cruds.map((crud) => {
							return (
								<tr key={crud.id}>
									<td>
										<Link to={`/questions/${crud.id}`} className="link-line">
											{crud.id}
										</Link>
									</td>
									<td>{renderData(crud.question)}</td>
										<td>{renderData(crud.options)}</td>
									<td>{renderData(crud.solution)}</td>
										<td>{renderData(crud.level)}</td>
										<td>{renderData(crud.question_type)}</td>
										<td>{renderData(crud.reference)}</td>
                                        <td>{renderData(crud.comprehension_question)}</td>
										<td>{renderData(crud.answer)}</td>
									<td>{renderData(crud.Course.courseName)}</td>
										<td>{renderData(crud.LessonId)}</td>

									<td>
										<Link to={`/questions/${crud.id}`} className="btn btn-warning">
											View
										</Link>
										<Link to={`/questions/edit/${crud.id}`} className="btn btn-primary btn-sm me-2">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(crud.id)} className="btn btn-danger btn-sm">
                        Delete
                      </button>
									</td>
									
									
								</tr>
							);
						})}
				</tbody>
			</table>
			</div>
		</div>
	);
}

export default QuestionCrudTable;