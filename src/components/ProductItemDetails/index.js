import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProducts from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProducts: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getformattedProductData = product => ({
    availability: product.availability,
    title: product.title,
    description: product.description,
    totalReviews: product.total_reviews,
    brand: product.brand,
    price: product.price,
    id: product.id,
    imageUrl: product.image_url,
    rating: product.rating,
    style: product.style,
  })

  changetoProduct = id => <Redirect to={`/products/${id}`} />

  getProductDetails = async () => {
    const {pId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const productId = match.params.id
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${productId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getformattedProductData(fetchedData)
      const similarProducts1 = fetchedData.similar_products.map(each =>
        this.getformattedProductData(each),
      )

      this.setState({
        apiStatus: apiStatusConstants.success,
        productData: updatedData,
        similarProducts: similarProducts1,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  minusSquare = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    } else {
      this.setState({quantity: 1})
    }
  }

  plusSquare = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductNotFound = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button>Continue Shopping</button>
      </Link>
    </div>
  )

  renderSimilarProductComponent = () => {
    const {similarProducts} = this.state
    return (
      <div className="thumbnail-img-details-container">
        <h1>Similar Products</h1>
        <div className="similar-products-container">
          {similarProducts.map(each => (
            <SimilarProducts
              eachProduct={each}
              key={each.style}
              changetoProduct={this.changetoProduct}
            />
          ))}
        </div>
      </div>
    )
  }

  renderProductDetails = () => {
    const {productData, quantity} = this.state
    return (
      <>
        <Header />
        <div className="product-img-details-container">
          <div className="product-image-container">
            <img
              src={productData.imageUrl}
              alt="product"
              className="product-image"
            />
          </div>
          <div className="product-details-container">
            <h1 className="title-para">{productData.title}</h1>
            <p className="price-para">Rs {productData.price}</p>
            <div className="rating-reviews-container">
              <div className="rating-para-container">
                <p>{productData.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="start"
                  className="star-img"
                />
              </div>
              <p>{productData.totalReviews} Reviews</p>
            </div>
            <p className="description-para">{productData.description}</p>
            <p className="availability-para">
              <span className="availability-span">Available:</span>
              {productData.availability}
            </p>
            <p className="brandname-para">
              <span className="brand-span">Brand:</span> {productData.brand}
            </p>
            <hr />
            <div className="quantity-container">
              <BsDashSquare
                className="bs-dash"
                testid="minus"
                onClick={this.minusSquare}
              />
              <p>{quantity}</p>
              <BsPlusSquare
                className="bs-plus"
                testid="plus"
                onClick={this.plusSquare}
              />
            </div>
            <button type="button" className="add-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProductComponent()}
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderProductNotFound()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails

// <SimilarProducts similarProducts={similarProducts} />
// console.log(similarProducts)
//     return (
//       <div className="main-container">
//         <Header />
//         {this.renderProductDetails()}
//       </div>
//     )
//   }
//
