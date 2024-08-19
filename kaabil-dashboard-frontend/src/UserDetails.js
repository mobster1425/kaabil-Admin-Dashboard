import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";


function UserCrudDetails(props) {
	const [crud, setCrud] = useState(null);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
	const [maxId, setMaxId] = useState(null);
	const { userId } = useParams();
	console.log("params =",userId)
	//const navigate = useNavigate();





	const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [userResponse, allUsersResponse] = await Promise.all([
			// https://admin.kaabil.me
       //   axios.get(`http://localhost:3001/api/user/${userId}`),
       //   axios.get('http://localhost:3001/api/users')

		  axios.get(`https://admin.kaabil.me/api/user/${userId}`),
          axios.get('https://admin.kaabil.me/api/users')
        ]);

        setCrud(userResponse.data);
        setMaxId(Math.max(...allUsersResponse.data.map(q => q.userId)));
      } catch (error) {
        console.log("error", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);


	/*
	useEffect(
		function () {
			async function getCrudById() {
				try {
					setLoading(true);
					const response = await axios.get(`http://localhost:3001/api/user/${userId}`);
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
		[userId]
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
		const prevId = parseInt(userId) - 1;
		if (prevId > 0) {
		  navigate(`/user/${prevId}`);
		}
	  };
	
	  const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this user?")) {
		  try {
			// await axios.delete(`http://localhost:3001/api/user/${userId}`);
			await axios.delete(`https://admin.kaabil.me/api/user/${userId}`);
			navigate("/users");
		  } catch (error) {
			console.error("Error deleting user:", error);
			setError("An error occurred while deleting the user.");
		  }
		}
	  };

	  const handleNext = () => {
		const nextId = parseInt(userId) + 1;
	//	if (nextId <= maxId) {
		  navigate(`/user/${nextId}`);
	//	}
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
			  <h2>User Details (ID: {userId})</h2>
<div>
<p><b>id</b>: {crudData.id}</p>
			<p><b>Display Name</b>: {renderData(crudData.displayName)}</p>
			<p><b>First Name</b>: {renderData(crudData.firstName)}</p>
			<p><b>Last Name</b>: {renderData(crudData.lastName)}</p>
			<p><b>Image url</b>: {renderData(crudData.image)}</p>
			<p><b>Email</b>: {renderData(crudData.email)}</p>
			<p><b>Created At</b>: {renderData(crudData.createdAt)}</p>
			
			





			<div className="btn-group mt-3">
          <button onClick={handlePrevious} className="btn btn-secondary" disabled={userId <= 1}>
            Previous
          </button>
          <button onClick={handleNext} className="btn btn-secondary" disabled={userId >= maxId}>
            Next
          </button>
          
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
          <Link to="/users" className="btn btn-secondary">
            Close
          </Link>
        
			</div>
			<hr />
			</div>
		</div>
	);
}

export default UserCrudDetails;