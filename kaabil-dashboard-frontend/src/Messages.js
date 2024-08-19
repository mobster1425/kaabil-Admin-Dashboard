
/*
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MessageCrudTable() {
	const [cruds, setCruds] = useState([]);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
	

	useEffect(function () {
		async function getCruds() {
			try {
				setLoading(true);
				const response = await axios.get("http://localhost:3001/api/messages/");
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


	
	// Helper function to safely render potentially nested data
	const renderData = (data) => {
		if (typeof data === 'object' && data !== null) {
			return JSON.stringify(data);
		}
		return data;
	};


	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this message?")) {
		  try {
			await axios.delete(`http://localhost:3001/api/messages/${id}`);
			setCruds(cruds.filter(crud => crud.id !== id));
		  } catch (error) {
			console.error("Error deleting message:", error);
			setError("An error occurred while deleting the message.");
		  }
		}
	  };

	if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!cruds) return <div>No data found</div>;

	return (
		<div className="container">
			<div>
				<h2>
					Messages Table View
					
				</h2>
				
        <hr />
				<hr />
			</div>
		
                        <div className="table-responsive">
			<table className="table riped  table-hover table-bordered container">
				<thead>
					<tr>
                    <th>Id</th>
					<th>First Name</th>
						<th>Last Name</th>
						<th>QuestionIndex</th>
						<th>Chats</th>
						<th>UserInput</th>
						<th>UserId</th>
						<th>QuestionId</th>
						<th>Created At</th>
						<th>View</th>
						
					</tr>
				</thead>
				<tbody>
					{cruds &&
						cruds.map((crud) => {
							return (
								<tr key={crud.id}>
									<td>
										<Link to={`/messages/${crud.id}`} className="link-line">
											{crud.id}
										</Link>
									</td>
									<td>{renderData(crud.User.firstName)}</td>
										<td>{renderData(crud.User.lastName)}</td>
									<td>{renderData(crud.questionIndex)}</td>
										<td>{renderData(crud.userInput)}</td>
										<td>{renderData(crud.chats)}</td>
										<td>{renderData(crud.UserId)}</td>
										
										<td>{renderData(crud.QuestionId)}</td>
																				<td>{renderData(crud.createdAt)}</td>
									<td>
										<Link to={`/messages/${crud.id}`} className="btn btn-warning">
											View
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

export default MessageCrudTable;

*/


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MessageCrudTable() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, [searchTerm, sort, currentPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
    //  const response = await axios.get("http://localhost:3001/api/messages/", {
		const response = await axios.get("https://admin.kaabil.me/api/messages/", {
	//	https://admin.kaabil.me
        params: {
          search: searchTerm,
          sort,
          page: currentPage,
        },
      });
      setMessages(response.data.messages);
      setTotalPages(response.data.numOfPages);
    } catch (error) {
      console.log("error", error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page when new search is performed
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
       // await axios.delete(`http://localhost:3001/api/messages/${id}`);
		await axios.delete(`https://admin.kaabil.me/api/messages/${id}`);
	//	https://admin.kaabil.me
        fetchMessages();
      } catch (error) {
        console.error("Error deleting message:", error);
        setError("An error occurred while deleting the message.");
      }
    }
  };

  const renderData = (data) => {
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data);
    }
    return data;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!messages) return <div>No data found</div>;

  return (
    <div className="container">
      <h2>Messages Table View</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by first name or last name... (Press Enter to search)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleSearch}
        />
      </div>
      <div className="mb-3">
        <select
          className="form-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>QuestionIndex</th>
              <th>Chats</th>
              <th>UserInput</th>
              <th>UserId</th>
              <th>QuestionId</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>
                  <Link to={`/messages/${message.id}`} className="link-line">
                    {message.id}
                  </Link>
                </td>
                <td>{renderData(message.User.firstName)}</td>
                <td>{renderData(message.User.lastName)}</td>
                <td>{renderData(message.questionIndex)}</td>
                <td>{renderData(message.chats)}</td>
                <td>{renderData(message.userInput)}</td>
                <td>{renderData(message.UserId)}</td>
                <td>{renderData(message.QuestionId)}</td>
                <td>
                  <Link to={`/messages/${message.id}`} className="btn btn-warning btn-sm me-2">
                    View
                  </Link>
                  <button onClick={() => handleDelete(message.id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {[...Array(totalPages).keys()].map((page) => (
              <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(page + 1)}>
                  {page + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default MessageCrudTable;