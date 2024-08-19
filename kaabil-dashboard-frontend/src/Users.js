import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function UserCrudTable() {
	const [cruds, setCruds] = useState([]);
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(function () {
		async function getCruds() {
			try {
				setLoading(true);
				// https://admin.kaabil.me
			//	const response = await axios.get("http://localhost:3001/api/users/");
			const response = await axios.get("https://admin.kaabil.me/api/users/");
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
		if (window.confirm("Are you sure you want to delete this user?")) {
		  try {
			// await axios.delete(`http://localhost:3001/api/user/${id}`);
			await axios.delete(`https://admin.kaabil.me/api/user/${id}`);
			setCruds(cruds.filter(crud => crud.id !== id));
		  } catch (error) {
			console.error("Error deleting user:", error);
			setError("An error occurred while deleting the user.");
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
					Users Table View
					
				</h2>
				<hr />
			</div>
		
                        <div className="table-responsive">
			<table className="table riped  table-hover table-bordered container">
				<thead>
					<tr>
                    <th>Id</th>
					<th>GoogleId</th>
						<th>Display Name</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Image</th>
						<th>Email</th>
						<th>CreatedAt</th>

						
					</tr>
				</thead>
				<tbody>
					{cruds &&
						cruds.map((crud) => {
							return (
								<tr key={crud.id}>
									<td>
										<Link to={`/user/${crud.id}`} className="link-line">
											{crud.id}
										</Link>
									</td>
									<td>{renderData(crud.googleId)}</td>
										<td>{renderData(crud.displayName)}</td>
									<td>{renderData(crud.firstName)}</td>
										<td>{renderData(crud.lastName)}</td>
										<td>{renderData(crud.image)}</td>
										<td>{renderData(crud.email)}</td>
                                        <td>{renderData(crud.createdAt)}</td>
									

									<td>
										<Link to={`/user/${crud.id}`} className="btn btn-warning">
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

export default UserCrudTable;