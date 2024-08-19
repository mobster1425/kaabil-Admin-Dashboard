import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FormatMessageDetails } from "./chat-formatting-algorithm";

function MessageCrudDetails() {
  const [crud, setCrud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formattedCrud, setFormattedCrud] = useState(null);
  const [isFormatted, setIsFormatted] = useState(true);
  const [availableIds, setAvailableIds] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [messageResponse, allMessagesResponse] = await Promise.all([
		// https://admin.kaabil.me
       // axios.get(`http://localhost:3001/api/messages/${id}`),
      //  axios.get('http://localhost:3001/api/messages')

		axios.get(`https://admin.kaabil.me/api/messages/${id}`),
        axios.get('https://admin.kaabil.me/api/messages')
      ]);

      setCrud(messageResponse.data);
      
      try {
        setFormattedCrud(FormatMessageDetails(messageResponse.data));
      } catch (formatError) {
        console.error("Error formatting message details:", formatError);
        setError("An error occurred while formatting the message details.");
      }

      let allMessages = allMessagesResponse.data;
      if (allMessagesResponse.data && allMessagesResponse.data.messages) {
        allMessages = allMessagesResponse.data.messages;
      }

      if (Array.isArray(allMessages)) {
        const ids = allMessages.map(m => m.id).sort((a, b) => a - b);
        setAvailableIds(ids);
      } else {
        console.error("Unexpected structure for all messages:", allMessagesResponse.data);
        setError("An error occurred while processing all messages.");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFormat = () => {
    setIsFormatted(!isFormatted);
  };

  const handlePrevious = () => {
    const currentIndex = availableIds.indexOf(parseInt(id));
    if (currentIndex > 0) {
      navigate(`/messages/${availableIds[currentIndex - 1]}`);
    }
  };

  const handleNext = () => {
    const currentIndex = availableIds.indexOf(parseInt(id));
    if (currentIndex < availableIds.length - 1) {
      navigate(`/messages/${availableIds[currentIndex + 1]}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
     //   await axios.delete(`http://localhost:3001/api/messages/${id}`);
	 await axios.delete(`https://admin.kaabil.me/api/messages/${id}`);
        navigate("/messages");
      } catch (error) {
        console.error("Error deleting message:", error);
        setError("An error occurred while deleting the message.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!crud) return <div>No data found</div>;

  const crudData = Array.isArray(crud) ? crud[0] : crud;

  return (
    <div className="container">
      <h2 className="mb-4">Message Details (ID: {id})</h2>
      <div className="card">
        <div className="card-body">
          <p className="card-text"><b>ID:</b> {crudData.id}</p>
          <p className="card-text"><b>Question Index:</b> {crudData.questionIndex}</p>
          <p className="card-text"><b>First Name:</b> {crudData.User.firstName}</p>
          <p className="card-text"><b>Last Name:</b> {crudData.User.lastName}</p>
          
          <div className="mb-3">
            <b>Chats:</b>
            <button onClick={toggleFormat} className="btn btn-primary btn-sm ml-2">
              {isFormatted ? "View Raw" : "Format"}
            </button>
            <div className="mt-2 border p-3" style={{maxHeight: '400px', overflowY: 'auto'}}>
              <pre className="mb-0" style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                {isFormatted ? formattedCrud.chats : JSON.stringify(crudData.chats, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mb-3">
            <b>User Input:</b>
            <div className="mt-2 border p-3">
              <pre className="mb-0" style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                {isFormatted ? formattedCrud.userInput : JSON.stringify(crudData.userInput, null, 2)}
              </pre>
            </div>
          </div>

          <p className="card-text"><b>User ID:</b> {crudData.UserId}</p>
          <p className="card-text"><b>Question ID:</b> {crudData.QuestionId}</p>
        </div>
      </div>

      <div className="mt-3">
        <button onClick={handlePrevious} className="btn btn-secondary mr-2" disabled={availableIds.indexOf(parseInt(id)) <= 0}>
          Previous
        </button>
        <button onClick={handleNext} className="btn btn-secondary mr-2" disabled={availableIds.indexOf(parseInt(id)) >= availableIds.length - 1}>
          Next
        </button>
        <Link to={`/messages/edit/${id}`} className="btn btn-primary mr-2">
          Edit
        </Link>
        <button onClick={handleDelete} className="btn btn-danger mr-2">
          Delete
        </button>
        <Link to="/messages" className="btn btn-secondary">
          Close
        </Link>
      </div>
    </div>
  );
}

export default MessageCrudDetails;






/*

	return (
		<div className="container">
			  <h2>Message Details (ID: {id})</h2>
<div>
<p><b>id</b>: {crudData.id}</p>
			<p><b>Question Index</b>: {renderData(crudData.questionIndex)}</p>
			<p><b>First Name</b>: {renderData(crudData.User.firstName)}</p>
			<p><b>Last Name</b>: {renderData(crudData.User.lastName)}</p>
			<p><b>chats</b>: {renderData(crudData.chats)}</p>
			<p><b>User Inputs</b>: {renderData(crudData.userInput)}</p>
			<p><b>User Id</b>: {renderData(crudData.UserId)}</p>
			<p><b>Question Id</b>: {renderData(crudData.QuestionId)}</p>
			

			<div className="btn-group ">
	
				<Link to="/messages" className="btn btn-secondary">
					Close
				</Link>
			</div>
			<hr />
			</div>
		</div>
	);

*/