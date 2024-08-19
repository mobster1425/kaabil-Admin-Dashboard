import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const QuestionEdit = () => {
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
    courseName: '',
    LessonId: ''
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { questionId } = useParams();

  useEffect(() => {
    const fetchQuestionAndCourses = async () => {
      try {
        const [questionResponse, coursesResponse] = await Promise.all([
            // https://admin.kaabil.me

       //   axios.get(`http://localhost:3001/api/question/${questionId}`),
       //   axios.get('http://localhost:3001/api/courses')


          axios.get(`https://admin.kaabil.me/api/question/${questionId}`),
          axios.get('https://admin.kaabil.me/api/courses')
        ]);
        
        const questionData = questionResponse.data;
        setFormData({
          ...questionData,
          options: JSON.stringify(questionData.options),
          CourseSubjectName: questionData.Course.CourseSubjectName
        });
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchQuestionAndCourses();
  }, [questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'options' ? JSON.parse(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   //   await axios.put(`http://localhost:3001/api/question/${questionId}`, formData);
   await axios.put(`https://admin.kaabil.me/api/question/${questionId}`, formData);
      navigate('/questions');
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Question</h2>
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
          <input
            type="text"
            className="form-control"
            id="options"
            name="options"
            value={JSON.stringify(formData.options)}
            onChange={handleChange}
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
       
        <button type="submit" className="btn btn-primary">Update Question</button>
      </form>
    </div>
  );
};

export default QuestionEdit;