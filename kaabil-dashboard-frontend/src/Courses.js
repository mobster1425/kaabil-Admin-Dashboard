import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CourseCrudTable() {
	const [cruds, setCruds] = useState([]);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(function () {
		async function getCruds() {
			try {
				setLoading(true);
				// const response = await axios.get("http://localhost:3001/api/courses/");
				 const response = await axios.get("https://admin.kaabil.me/api/courses/");
				// https://admin.kaabil.me
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


	const handleDelete = async (subjectName) => {
		if (window.confirm("Are you sure you want to delete this course?")) {
		  try {
		//	 await axios.delete(`http://localhost:3001/api/course/${subjectName}`);
			await axios.delete(`https://admin.kaabil.me/api/course/${subjectName}`);
			setCruds(cruds.filter(crud => crud.subjectName !== subjectName));
		  } catch (error) {
			console.error("Error deleting course:", error);
			setError("An error occurred while deleting the course.");
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
					Courses Table View
					
				</h2>
				<Link to="/courses/create" className="btn btn-primary mb-3">
          Create New Course
        </Link>
				<hr />
			</div>
		
                        <div className="table-responsive">
			<table className="table table-striped table-hover table-bordered container">
				<thead>
					<tr>
                    <th>Subjct Name</th>
					<th>Course Description</th>
						<th>User Id</th>
						<th>Created At</th>

						
					</tr>
				</thead>
				<tbody>
					{cruds &&
						cruds.map((crud) => {
							return (
								<tr key={crud.subjectName}>
									<td>
										<Link to={`/course/${crud.subjectName}`} className="link-line">
											{crud.subjectName}
										</Link>
									</td>
									<td>{renderData(crud.courseDescription)}</td>
										<td>{renderData(crud.UserId)}</td>
									<td>{renderData(crud.createdAt)}</td>


									<td>
										<Link to={`/course/${crud.subjectName}`} className="btn btn-warning">
											View
										</Link>
										<Link to={`/courses/edit/${crud.subjectName}`} className="btn btn-primary btn-sm me-2">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(crud.subjectName)} className="btn btn-danger btn-sm">
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

export default CourseCrudTable;