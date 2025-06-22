import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { getAiringTodayTV, getPopularTV, getTopRatedTV, IGetTVResult } from '../api'
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
  height: 80vh;
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
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  height: 250px;
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

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
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

const BigTV = styled(motion.div)`
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

function TV() {
  const history = useHistory();
  const bigTVMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { data: airingData, isLoading: airingLoading } = useQuery<IGetTVResult>(['tv', 'airing'], getAiringTodayTV);
  const { data: popularData, isLoading: popularLoading } = useQuery<IGetTVResult>(['tv', 'popular'], getPopularTV);
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<IGetTVResult>(['tv', 'topRated'], getTopRatedTV);
  
  const [airingIndex, setAiringIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  

  const increaseAiringIndex = () => {
    if (airingData?.results) {
      if (leaving) return;
      setLeaving(true);
      const totalTV = airingData.results.length;
      const maxIndex = Math.floor(totalTV / offset) - 1;
      setAiringIndex((prev) => prev === maxIndex ? 0 : prev + 1);
    }
  };

  const increasePopularIndex = () => {
    if (popularData?.results) {
      if (leaving) return;
      setLeaving(true);
      const totalTV = popularData.results.length;
      const maxIndex = Math.floor(totalTV / offset) - 1;
      setPopularIndex((prev) => prev === maxIndex ? 0 : prev + 1);
    }
  };

  const increaseTopRatedIndex = () => {
    if (topRatedData?.results) {
      if (leaving) return;
      setLeaving(true);
      const totalTV = topRatedData.results.length;
      const maxIndex = Math.floor(totalTV / offset) - 1;
      setTopRatedIndex((prev) => prev === maxIndex ? 0 : prev + 1);
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  const clickedTV = bigTVMatch?.params.tvId &&
    (airingData?.results?.find((tv) => tv.id === +bigTVMatch.params.tvId) ||
     popularData?.results?.find((tv) => tv.id === +bigTVMatch.params.tvId) ||
     topRatedData?.results?.find((tv) => tv.id === +bigTVMatch.params.tvId));

  const isLoading = airingLoading || popularLoading || topRatedLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increasePopularIndex}
            bgPhoto={makeImagePath(popularData?.results?.[0]?.backdrop_path || "")}>
            <Title>{popularData?.results?.[0]?.name}</Title>
          </Banner>

          <Slider>
            <SliderTitle onClick={increaseAiringIndex}>Airing Today</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={airingIndex}
              >
                {airingData?.results?.slice(offset * airingIndex, offset * airingIndex + offset)
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

          <Slider>
            <SliderTitle onClick={increasePopularIndex}>Popular</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results?.slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
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

          <Slider>
            <SliderTitle onClick={increaseTopRatedIndex}>Top Rated</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topRatedIndex}
              >
                {topRatedData?.results?.slice(offset * topRatedIndex, offset * topRatedIndex + offset)
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
            {bigTVMatch ? (
              <>
                <Overlay onClick={() => history.goBack()} animate={{ opacity: 1 }} />
                <BigTV layoutId={bigTVMatch.params.tvId}>
                  {clickedTV && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTV.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTV?.name}</BigTitle>
                      <BigOverview>{clickedTV?.overview}</BigOverview>
                    </>
                  )}
                </BigTV>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default TV