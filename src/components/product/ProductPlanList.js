import { Link } from "react-router-dom";
import { pageUrls } from "../../utils/constants";

const ProductPlanList = ({ authToken, productPlanData }) => {
  return (
    <ul className="flex m--y-1">
      {productPlanData.map(({ description, id, name, price }) => (
        <li key={id} className="flex--1-of-3 shadow p--2 w--max m--y-2">
          <p className="text--dark">
            <strong>{name}</strong>
          </p>

          <p className="m--y-1">{description}</p>

          <p className="bg--light text--dark w--max p--tiny brad h2">
            {price.currency === "usd" ? "$" : "Price"}
            <strong> {price.unit_amount / 100}</strong>
            {price.recurring && ` per ${price.recurring.interval}`}
          </p>

          {authToken && (
            <Link
              to={`${pageUrls.productPlans}/?selectedPlan=${name}&prod_id=${id}&price_id=${price.id}`}
              className="link--info"
            >
              Subscribe to {name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ProductPlanList;
