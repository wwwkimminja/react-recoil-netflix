import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { IGetMoviesResult, searchMovies, searchTV } from '../api';
import styled from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from '../utils';
import { useHistory, useRouteMatch } from 'react-router-dom';

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
  color: white;
`;

const SearchTitle = styled.h2`
  font-size: 32px;
  color: white;
  padding: 60px;
  margin-bottom: 20px;
`;

const Slider = styled.div`
  position: relative;
  height: 250px;
  margin-bottom: 50px;
`;

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
`;

const Arrow = styled.div`
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
  padding: 0 60px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  position: absolute;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 50px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${props => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

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
    x: window.outerWidth + 5
  },
  visible: {
    x: 0
  },
  exit: {
    x: -window.outerWidth - 5
  }
};

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
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween"
    }
  }
};

const offset = 6;

function Search() {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword") || "";
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/search/:movieId");
  const { data: movieData, isLoading: movieLoading } = useQuery<IGetMoviesResult>(['searchMovies', keyword], () => searchMovies(keyword));
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetMoviesResult>(['searchTV', keyword], () => searchTV(keyword));
  
  const [movieIndex, setMovieIndex] = useState(0);
  const [tvIndex, setTvIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseMovieIndex = () => {
    if (movieData?.results) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = movieData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieIndex((prev) => prev === maxIndex ? 0 : prev + 1);
    }
  };

  const increaseTvIndex = () => {
    if (tvData?.results) {
      if (leaving) return;
      setLeaving(true);
      const totalTV = tvData.results.length;
      const maxIndex = Math.floor(totalTV / offset) - 1;
      setTvIndex((prev) => prev === maxIndex ? 0 : prev + 1);
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/search/${movieId}`);
  };

  const clickedMovie = bigMovieMatch?.params.movieId &&
    (movieData?.results?.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
     tvData?.results?.find((tv) => tv.id === +bigMovieMatch.params.movieId));

  const isLoading = movieLoading || tvLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SearchTitle>Search Results for: "{keyword}"</SearchTitle>
          
          {/* Movies Slider */}
          <Slider>
            <SliderTitle >Movies</SliderTitle>
            <Arrow onClick={increaseMovieIndex}>{">"}</Arrow>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={movieIndex}
              >
                {movieData?.results?.slice(offset * movieIndex, offset * movieIndex + offset)
                  .map(movie => (
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
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* TV Shows Slider */}
          <Slider>
            <SliderTitle >TV Shows</SliderTitle>
            <Arrow onClick={increaseTvIndex}>{">"}</Arrow>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={tvIndex}
              >
                {tvData?.results?.slice(offset * tvIndex, offset * tvIndex + offset)
                  .map(tv => (
                    <Box
                      variants={boxVariants}
                      key={tv.id}
                      layoutId={tv.id + ""}
                      onClick={() => onBoxClicked(tv.id)}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={() => history.goBack()} animate={{ opacity: 1 }} />
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie?.title || clickedMovie?.name}</BigTitle>
                      <BigOverview>{clickedMovie?.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search