import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CourseCreate() {
	const navigate = useNavigate();
	const [course, setCourse] = useState({
		subjectName: "",
		courseDescription: "",
		UserId: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		//	 await axios.post("http://localhost:3001/api/courses", course);
           // `https://www.kaabil.me/api/lessons/questions/${subject}/${lessonId}`
            await axios.post("https://admin.kaabil.me/api/courses", course);
			navigate("/courses");
		} catch (error) {
			console.error("Error creating course:", error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCourse({ ...course, [name]: value });
	};

	return (
		<div className="container">
			<h2>Create New Course</h2>
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
				<button type="submit" className="btn btn-primary">Create Course</button>
			</form>
		</div>
	);
}

export default CourseCreate;