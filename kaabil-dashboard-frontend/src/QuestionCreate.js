import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuestionCreate = () => {
  const [formData, setFormData] = useState({
    question: '',
    options: '',
    solution: '',
    reference: '',
    level: 'easy',
    question_type: 'MCQ',
    comprehension_question: '',
    question_image: '',
    answer: '',
  //  CourseSubjectName: '',
  courseName: '',
    LessonId: ''
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
      //  https://admin.kaabil.me
      //  const response = await axios.get('http://localhost:3001/api/courses');
      const response = await axios.get('https://admin.kaabil.me/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'options' ? value : value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        options: JSON.parse(formData.options)
      };
      await axios.post('http://localhost:3001/api/questions', dataToSubmit);
      navigate('/questions');
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="question" className="form-label">Question</label>
          <textarea
            className="form-control"
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
  <label htmlFor="options" className="form-label">Options (JSON format)</label>
  <textarea
    className="form-control"
    id="options"
    name="options"
    value={formData.options}
    onChange={handleChange}
    rows="4"
  />
</div>
        
        <div className="mb-3">
          <label htmlFor="solution" className="form-label">Solution</label>
          <textarea
            className="form-control"
            id="solution"
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reference" className="form-label">Reference</label>
          <input
            type="text"
            className="form-control"
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="level" className="form-label">Level</label>
          <select
            className="form-control"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="question_type" className="form-label">Question Type</label>
          <select
            className="form-control"
            id="question_type"
            name="question_type"
            value={formData.question_type}
            onChange={handleChange}
          >
            <option value="COMPREHENSION">Comprehension</option>
            <option value="LIST BASED">List Based</option>
            <option value="MCQ">MCQ</option>
            <option value="Numerical">Numerical</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="comprehension_question" className="form-label">Comprehension Question</label>
          <textarea
            className="form-control"
            id="comprehension_question"
            name="comprehension_question"
            value={formData.comprehension_question}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="question_image" className="form-label">Question Image URL</label>
          <input
            type="text"
            className="form-control"
            id="question_image"
            name="question_image"
            value={formData.question_image}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="answer" className="form-label">Answer</label>
          <input
            type="text"
            className="form-control"
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="CourseSubjectName" className="form-label">Course Name</label>
          <select
            className="form-control"
            id="CourseSubjectName"
            name="CourseSubjectName"
            value={formData.courseName}
            onChange={handleChange}
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.subjectName}>
                {course.subjectName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="LessonId" className="form-label">Lesson ID</label>
          <input
            type="number"
            className="form-control"
            id="LessonId"
            name="LessonId"
            value={formData.LessonId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Question</button>
      </form>
    </div>
  );
};

export default QuestionCreate;