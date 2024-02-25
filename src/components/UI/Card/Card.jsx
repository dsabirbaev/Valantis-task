

import "./style.scss";

const Card = ({data:{brand, price, product, id}}) => {
  return (
    <div className="card">
      <h2 className="card-title">{product}</h2>
      <p className="card-id"> <span>ID:</span> <span className="card-id__num">{id}</span></p>
      <div className="card-main">
        <p className="card-brand"> <span>Brand: </span> <span>{brand == null ? "-": brand} </span></p>   
        <p className="card-price"><span>Price:</span> <span>{price}</span></p>
      </div>
    </div>
  )
}

export default Card;