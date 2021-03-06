import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {getAllShovels, getAllShovels2} from '../store/shovels'
import styled from 'styled-components'
import Review from './review'
import InfiniteScroll from 'react-infinite-scroll-component'

const Loader = styled.img`
max-height: 25vh
max-width: 25vw`

const ShovelCard = styled.div`
  width: '100%';
  border: 1px solid grey;
  border-radius: 10px;
  margin: 4px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.75);
`
export const ShovelsCont = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const FiltersDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Shovel = styled.div`
  display: flex;
  flex-direction: row;
  width: 300px;
  height: 220px;
`

const ImageDiv = styled.div`
  display; flex;
  flex-direction: column;
  justify-content: center
  width: 50%;
`

const InfoDiv = styled.div`
  display; flex;
  width: 50%;
  color: #1A1A1A;
`
export const StyledInfiniteScroll = styled(InfiniteScroll)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`
const RatingDiv = styled.div`
  display: flex;
  flex-direction: row;
  // margin: 10px;
`

const Image = styled.img`
  border-radius: 10px 0px 0px 0px;
  margin: 10px;
  margin-top: 40px;
`

const StyledLink = styled(Link)``

const AvgRating = props => {
  var avg = 0

  if (!props.shovel.reviews) {
    avg = 0
  } else {
    props.shovel.reviews.forEach(review => {
      avg += review.rating
    })

    avg = avg / props.shovel.reviews.length
  }

  return (
    <RatingDiv>
      <Review value={avg} />
      {props.shovel.reviews.length}
    </RatingDiv>
  )
}

const ShovelDiv = props => {
  return (
    <ShovelCard>
      <StyledLink to={`/shovels/${props.shovel.id}`}>
        <Shovel>
          <ImageDiv>
            <Image src={props.shovel.imageUrl} style={{width: 100}} />
          </ImageDiv>

          <InfoDiv>
            <span>{props.shovel.brand}</span>
            <h5>{props.shovel.title}</h5>
            <AvgRating shovel={props.shovel} />
            <h6>${props.shovel.price / 100}</h6>
          </InfoDiv>
        </Shovel>
      </StyledLink>
    </ShovelCard>
  )
}

class AllShovelsView extends React.Component {
  constructor() {
    super()

    this.state = {
      search: 'all',
      hasMore: true,
      offset: 0,
      shovels: []
    }

    this.selectShovels = this.selectShovels.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  fetchMoreData = () => {
    setTimeout(() => {
      this.selectShovels(null, undefined, this.state.offset + 25, true)

      if (this.state.offset + 25 - this.props.shovels.length !== 0) {
        this.setState({
          hasMore: false
        })
      }

      this.setState({
        offset: this.state.offset + 25
      })
    }, 1000)
  }

  componentDidMount() {
    this.props.getShovels2(this.state.search, 'all', 'none', 0, 'all')

    this.setState({
      shovels: this.props.shovels
    })
  }

  handleSearch(evt) {
    evt.preventDefault()

    this.setState({
      shovels: this.state.shovels.concat(this.props.shovels)
    })
    var searchName = evt.target.search.value
    this.setState({
      search: searchName
    })

    if (searchName === '') {
      searchName = 'all'
    }

    this.selectShovels(null, searchName)
  }

  selectShovels(evt, search, offset, scroll) {
    var elem = document.getElementById('typeSelect')
    var type = elem.options[elem.selectedIndex].value

    var elem2 = document.getElementById('sortBySelect')
    var sort = elem2.options[elem2.selectedIndex].value

    var elem3 = document.getElementById('brandName')
    var brand = elem3.options[elem3.selectedIndex].value

    var OS = offset
    if (!OS) {
      OS = this.state.offset
    }

    if (!search) {
      var searchName = document.getElementById('searchBar').value
      if (!searchName || searchName === undefined) {
        searchName = 'all'
      }

      if (scroll) {
        this.props.getShovels(searchName, type, sort, OS, brand)
      } else {
        this.setState({
          offset: 0,
          hasMore: true
        })

        this.props.getShovels2(searchName, type, sort, 0, brand)
      }
    } else if (search) {
      var newSearch = search
      if (!search || search === undefined) {
        newSearch = 'all'
      }

      if (scroll) {
        this.props.getShovels(newSearch, type, sort, OS, brand)
      } else {
        this.setState({
          offset: 0,
          hasMore: true
        })
        this.props.getShovels2(newSearch, type, sort, 0, brand)
      }
    }
  }

  render() {
    var shovels = this.props.shovels
    var brands = this.props.brands.sort()

    return (
      <ShovelsCont>
        <div>
          <form onSubmit={this.handleSearch}>
            <input id="searchBar" name="search" placeholder="search..." />
            <button type="submit">search</button>
          </form>
        </div>
        <FiltersDiv>
          <div>
            <h6>brand:</h6>
            <select
              style={{maxWidth: 100}}
              id="brandName"
              onChange={() => this.selectShovels()}
            >
              <option value="all">All brands</option>
              {brands.map(brand => {
                if (brand !== '') {
                  return (
                    <option key={brand} value={`${brand}`}>
                      {brand}
                    </option>
                  )
                }
              })}
            </select>
          </div>

          <div>
            <h6>Category:</h6>
            <select id="typeSelect" onChange={() => this.selectShovels()}>
              <option value="all">All shovels</option>
              <option value="mouthShovel">Mouth shovels</option>
              <option value="kitchenShovel">Kitchen shovels</option>
              <option value="snowShovel">Snow shovels</option>
              <option value="yardShovel">Yard shovels</option>
            </select>
          </div>

          <div>
            <h6>Sort by:</h6>
            <select id="sortBySelect" onChange={this.selectShovels}>
              <option value="none">none</option>
              <option value="ASC">Price: low to high</option>
              <option value="DESC">Price: high to low</option>
            </select>
          </div>
        </FiltersDiv>
        <h6> Displaying {shovels.length} items</h6>

        {!shovels.length > 0 ? (
          <h5>No shovels found </h5>
        ) : (
          <StyledInfiniteScroll
            dataLength={this.props.shovels.length}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={
              <Loader src="https://yachtclubgames.com/wp-content/uploads/2017/03/shovelKnight007.png" />
            }
            endMessage={
              <p style={{textAlign: 'center'}}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {shovels.map(shovel => {
              return <ShovelDiv key={shovel.id} shovel={shovel} />
            })}
          </StyledInfiniteScroll>
        )}
      </ShovelsCont>
    )
  }
}

const mapState = state => {
  return {
    shovels: state.shovels,
    reviews: state.reviews,
    brands: state.brands
  }
}

const mapDispatch = dispatch => {
  return {
    getShovels: (title, type, sort, offset, brand) =>
      dispatch(getAllShovels(title, type, sort, offset, brand)),

    getShovels2: (title, type, sort, offset, brand) =>
      dispatch(getAllShovels2(title, type, sort, offset, brand))
  }
}

export default connect(mapState, mapDispatch)(AllShovelsView)
