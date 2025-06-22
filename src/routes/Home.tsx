import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { getMovies, getLatestMovies, getTopRatedMovies, getUpcomingMovies, IGetMoviesResult } from '../api'
import styled from 'styled-components'
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { makeImagePath } from '../utils'
import { useHistory, useRouteMatch } from 'react-router-dom'
const Wrapper = styled.div`
  background: black;
  width: 100vw;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;
const Slider = styled.div`
position:relative;
top:-100px;
height:250px;


  
`
const SliderTitle = styled.h3`
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
  padding-left: 60px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    color: #e5e5e5;
  }
`
const Row = styled(motion.div)`
display: grid;
gap:5px;
grid-template-columns: repeat(6,1fr);
margin-bottom: 5px;
position:absolute;
width: 100%;
`
const Box = styled(motion.div) <{ bgPhoto: string }>`
background-color: white;
height: 200px;
background-image: url(${(props) => props.bgPhoto});
background-size: cover;
background-position: center center;
&:first-child{
  transform-origin:center left;
}
&:last-child{
  transform-origin:center right;

}
`

const Info = styled(motion.div)`
  padding:10px;
  position:absolute;
  background-color:${props => props.theme.black.lighter};
  opacity:0;
  width: 100%;
  bottom:0;
  h4 {
    text-align:center;
    font-size:18px;
  }

`

const Overlay = styled(motion.div)`
position:fixed;
top:0;
width:100%;
height:100%;
background-color:rgba(0,0,0,0.5);
opacity:0;
`

const BigMovie = styled(motion.div)`
position:fixed;
width:40vw;
height:80vh;
top:50px;
left:0;
right:0;
margin:0 auto;
background-color:${props => props.theme.black.lighter};
border-radius: 15px;
overflow: hidden;
`


const BigCover = styled.div`
width: 100%;
background-size: cover;
background-position: center center;
height: 400px;
`;

const BigTitle = styled.h3`
color: ${(props) => props.theme.white.lighter};
padding: 20px;
font-size: 46px;
position: relative;
top: -80px;
`;

const BigOverview = styled.p`
padding: 20px;
position: relative;
top: -80px;
color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    //user's screen width + 5px
    x: window.outerWidth + 5
  },
  visible: {
    x: 0
  },
  exit: {
    x: -window.outerWidth - 5
  }
}
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween"
    }

  }
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween"
    }
  }
}
const offset = 6;

function Home() {
  const history = useHistory()
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  console.log(bigMovieMatch)
  const { data, isLoading } = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies)
  const { data: latestData } = useQuery<IGetMoviesResult>(['movies', 'latest'], getLatestMovies)
  const { data: topRatedData } = useQuery<IGetMoviesResult>(['movies', 'topRated'], getTopRatedMovies)
  const { data: upcomingData } = useQuery<IGetMoviesResult>(['movies', 'upcoming'], getUpcomingMovies)
  
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false);
  const [latestIndex, setLatestIndex] = useState(0)
  const [topRatedIndex, setTopRatedIndex] = useState(0)
  const [upcomingIndex, setUpcomingIndex] = useState(0)
const {scrollY} = useScroll();

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length - 1; // banner item -1
      const maxIndex = Math.floor(totalMovies / offset) - 1 // page from 0
      setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
    }
  }
  
  const increaseLatestIndex = () => {
    if (latestData?.results) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = latestData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1
      setLatestIndex((prev) => prev === maxIndex ? 0 : prev + 1)
    }
  }
  
  const increaseTopRatedIndex = () => {
    if (topRatedData?.results) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = topRatedData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1
      setTopRatedIndex((prev) => prev === maxIndex ? 0 : prev + 1)
    }
  }
  
  const increaseUpcomingIndex = () => {
    if (upcomingData?.results) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = upcomingData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1
      setUpcomingIndex((prev) => prev === maxIndex ? 0 : prev + 1)
    }
  }
  
  const toggleLeaving = () => {
    setLeaving((prev) => !prev)
  }

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`)
  }

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (data?.results?.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
     latestData?.results?.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
     topRatedData?.results?.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
     upcomingData?.results?.find((movie) => movie.id === +bigMovieMatch.params.movieId));


  return (
    <Wrapper >
      {isLoading ? <Loader>Loading..</Loader> : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0]?.backdrop_path || "")}>
            <Title>{data?.results[0]?.title}</Title>
            <Overview>{data?.results[0]?.overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle onClick={increaseIndex}>Now Playing</SliderTitle>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results?.slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(movie =>
                    <Box
                      variants={boxVariants}
                      key={movie.id}
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants} >
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>

                  )}

              </Row>
            </AnimatePresence>
          </Slider>
          
          <Slider>
            <SliderTitle onClick={increaseLatestIndex}>Popular Movies</SliderTitle>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={latestIndex}
              >
                {latestData?.results?.slice(offset * latestIndex, offset * latestIndex + offset)
                  .map(movie =>
                    <Box
                      variants={boxVariants}
                      key={movie.id}
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants} >
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  )}
              </Row>
            </AnimatePresence>
          </Slider>
          
          <Slider>
            <SliderTitle onClick={increaseTopRatedIndex}>Top Rated Movies</SliderTitle>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topRatedIndex}
              >
                {topRatedData?.results?.slice(offset * topRatedIndex, offset * topRatedIndex + offset)
                  .map(movie =>
                    <Box
                      variants={boxVariants}
                      key={movie.id}
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants} >
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  )}
              </Row>
            </AnimatePresence>
          </Slider>
          
          <Slider>
            <SliderTitle onClick={increaseUpcomingIndex}>Upcoming Movies</SliderTitle>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={upcomingIndex}
              >
                {upcomingData?.results?.slice(offset * upcomingIndex, offset * upcomingIndex + offset)
                  .map(movie =>
                    <Box
                      variants={boxVariants}
                      key={movie.id}
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants} >
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  )}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? 
            <>
            <Overlay onClick={() => history.push("/")} animate={{opacity:1}}/>
            <BigMovie

              layoutId={bigMovieMatch.params.movieId}> 
              {clickedMovie &&
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                      clickedMovie.backdrop_path,
                      "w500"
                    )})`,
                  }}
                />
                <BigTitle>{clickedMovie?.title}</BigTitle>
                <BigOverview>{clickedMovie?.overview}</BigOverview>
              </>}

            </BigMovie>
            </>: null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  )
}

export default Home