import { Link } from "react-router-dom";

const Dashboard = ({ data }) => {
  if (!data || !data.data) return null;

  // Destructure data
  const { name, productPlan } = data.data;

  return (
    <>
      <div className="p--1 m--y-1 outline">
        <h2>Hello {name.first}</h2>

        <p className="m--y-1">Welcome to your Taskify dashboard</p>

        <p>
          {productPlan.name ? (
            <>
              You are in the
              <b className="text--info"> {productPlan.name}</b>.
            </>
          ) : (
            <i className="bg--light p--tiny">
              You are not subscribed to any plan
            </i>
          )}

          <span className="d--block m--y-1">
            <Link to="/product-plans" className="link--info">
              {productPlan.name ? "Change plan" : "See available plans"}
            </Link>
          </span>
        </p>
      </div>
    </>
  );
};

export default Dashboard;
