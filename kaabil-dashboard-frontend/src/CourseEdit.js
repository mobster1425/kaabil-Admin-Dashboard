import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function CourseEdit() {
	const navigate = useNavigate();
	const { subjectName } = useParams();
	const [course, setCourse] = useState({
		subjectName: "",
		courseDescription: "",
		UserId: "",
	});

	useEffect(() => {
		const fetchCourse = async () => {
			try {
			//	const response = await axios.get(`http://localhost:3001/api/course/${subjectName}`);
            const response = await axios.get(`https://admin.kaabil.me/api/course/${subjectName}`);
                
				setCourse(response.data);
			} catch (error) {
				console.error("Error fetching course:", error);
			}
		};
		fetchCourse();
	}, [subjectName]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		//	await axios.put(`http://localhost:3001/api/course/${subjectName}`, course);
        await axios.put(`https://admin.kaabil.me/api/course/${subjectName}`, course);
			navigate("/courses");
		} catch (error) {
			console.error("Error updating course:", error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCourse({ ...course, [name]: value });
	};

	return (
		<div className="container">
			<h2>Edit Course</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="subjectName" className="form-label">Subject Name</label>
					<input
						type="text"
						className="form-control"
						id="subjectName"
						name="subjectName"
						value={course.subjectName}
						onChange={handleInputChange}
						required
						readOnly
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="courseDescription" className="form-label">Course Description</label>
					<textarea
						className="form-control"
						id="courseDescription"
						name="courseDescription"
						value={course.courseDescription}
						onChange={handleInputChange}
						required
					></textarea>
				</div>
				<div className="mb-3">
					<label htmlFor="UserId" className="form-label">User ID</label>
					<input
						type="number"
						className="form-control"
						id="UserId"
						name="UserId"
						value={course.UserId}
						onChange={handleInputChange}
						
					/>
				</div>
				<button type="submit" className="btn btn-primary">Update Course</button>
			</form>
		</div>
	);
}

export default CourseEdit;