import React from "react";
import "./Admin.css";
import Admin_header from "./Admin_header";
import Admin_sidebar from "./Admin_sidebar";
function Admin_index() {
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userinfo = localStorage.getItem("user");
    if (!userinfo) {
      setError("No user information found");
      return;
    }

    fetch("api/Backend/admin/", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setPartners(data.trustedPartners);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {partners ? (
        <div>
          <Admin_header />
          <section className="admin_contains">
            <div className="side_bar">
              <Admin_sidebar />
            </div>
            <div className="Right_contains">
              <h2>Dashbord</h2>
              <div className="right_contains_items">
                <div className="right_contains_item">
                  <i className="fa-solid fa-book" />
                  <span>0</span>
                  <p>total no of Book</p>
                </div>
                <div className="right_contains_item">
                  <i className="fa-solid fa-users" />
                  <span>0</span>
                  <p>total number of users</p>
                </div>
                <div className="right_contains_item">
                  <i className="fa-solid fa-book" />
                  <span>0</span>
                  <p>booked book</p>
                </div>
                <div className="right_contains_item">fsf</div>
                <div className="right_contains_item">sfsf</div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div>Error</div>
      )}
    </>
  );
}

export default Admin_index;
