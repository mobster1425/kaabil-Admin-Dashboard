import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

function CourseCrudDetails(props) {
	const [crud, setCrud] = useState(null);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
	const [allCourses, setAllCourses] = useState([]);
//	const [maxId, setMaxId] = useState(null);
	const { subjectName } = useParams();
	console.log("params =",subjectName)
	//const navigate = useNavigate();




	

	const navigate = useNavigate();
	useEffect(() => {
		async function fetchData() {
		  try {
			setLoading(true);
			const [courseResponse, allCoursesResponse] = await Promise.all([
			//  axios.get(`http://localhost:3001/api/course/${subjectName}`),
			 axios.get(`https://admin.kaabil.me/api/course/${subjectName}`),
			//  https://admin.kaabil.me
			 //  axios.get('http://localhost:3001/api/courses')
			  axios.get('https://admin.kaabil.me/api/courses')
			]);
	
			setCrud(courseResponse.data);
			setAllCourses(allCoursesResponse.data);
		  } catch (error) {
			console.log("error", error);
			setError("An error occurred while fetching data.");
		  } finally {
			setLoading(false);
		  }
		}
		fetchData();
	  }, [subjectName]);



	/*
	useEffect(
		function () {
			async function getCrudById() {
				try {
					setLoading(true);
					const response = await axios.get(`http://localhost:3001/api/course/${subjectName}`);
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
		[subjectName]
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
		const currentIndex = allCourses.findIndex(course => course.subjectName === subjectName);
		if (currentIndex > 0) {
		  navigate(`/course/${allCourses[currentIndex - 1].subjectName}`);
		}
	  };


	
	  const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this course?")) {
		  try {
			// https://admin.kaabil.me
			await axios.delete(`https://admin.kaabil.me/api/course/${subjectName}`);
			navigate("/courses");
		  } catch (error) {
			console.error("Error deleting course:", error);
			setError("An error occurred while deleting the course.");
		  }
		}
	  };


	  const handleNext = () => {
		const currentIndex = allCourses.findIndex(course => course.subjectName === subjectName);
		if (currentIndex < allCourses.length - 1) {
		  navigate(`/course/${allCourses[currentIndex + 1].subjectName}`);
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
			  <h2>Course Details (ID: {subjectName})</h2>
<div>
<p><b>id</b>: {crudData.subjectName}</p>
			<p><b>Course Description</b>: {renderData(crudData.courseDescription)}</p>
			<p><b>First Name</b>: {renderData(crudData.UserId)}</p>
			<p><b>Last Name</b>: {renderData(crudData.createdAt)}</p>
			




			<div className="btn-group mt-3">
          <button onClick={handlePrevious} className="btn btn-secondary" disabled={allCourses.indexOf(crudData) === 0}>
            Previous
          </button>
          <button onClick={handleNext} className="btn btn-secondary" disabled={allCourses.indexOf(crudData) === allCourses.length - 1}>
            Next
          </button>
          <Link to={`/course/edit/${subjectName}`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
          <Link to="/courses" className="btn btn-secondary">
            Close
          </Link>
        
			</div>
			<hr />
			</div>
		</div>
	);
}

export default CourseCrudDetails;