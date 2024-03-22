import {Link} from 'react-router-dom'
import './index.css'

const SimilarProducts = props => {
  const {eachProduct, changetoProduct} = props
  const {id} = eachProduct
  const imageClicked = () => {
    changetoProduct(id)
  }
  return (
    <>
      <div className="thumbnails-main-container">
        <Link to={`/products/${eachProduct.id}`}>
          <div className="container-thumbnail">
            <img
              src={eachProduct.imageUrl}
              alt="similar product"
              className="product-thumbnail"
            />
            <h1 className="title-thumbnail">{eachProduct.title}</h1>
            <p className="brand-thumbnail">by {eachProduct.brand}</p>
            <div className="price-rating-thumbnail">
              <p>Rs {eachProduct.price}</p>
              <div className="rating-img-thumbnail">
                <p>{eachProduct.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="start"
                  className="star-img-thumbnail"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}

export default SimilarProducts
