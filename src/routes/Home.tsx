import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { getMovies, IGetMoviesResult } from '../api'
import styled from 'styled-components'
import { motion, AnimatePresence } from "framer-motion"
import { makeImagePath } from '../utils'
const Wrapper = styled.div`
  background: black;
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

const Info=styled(motion.div)`
  padding:10px;
  position:absolute;
  background-color:${props=>props.theme.black.lighter};
  opacity:0;
  width: 100%;
  bottom:0;
  h4 {
    text-align:center;
    font-size:18px;
  }

`
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
}
const boxVariants={
  normal:{
    scale:1,
  },
  hover:{
    scale:1.3,
    y:-80,
    transition:{
      delay:0.5,
      duration:0.2,
      type:"tween"
    }

  }
}

const infoVariants={
  hover:{
    opacity:1,
    transition:{
      delay:0.5,
      duration:0.2,
      type:"tween"
    }
  }
}
const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies)
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length - 1; // banner item -1
      const maxIndex = Math.floor(totalMovies / offset) - 1 // page from 0
      setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
    }
  }
  const toggleLeaving = () => {
    setLeaving((prev) => !prev)
  }
  return (
    <Wrapper >
      {isLoading ? <Loader>Loading..</Loader> : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
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
                {data?.results.slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(movie =>
                    <Box
                    variants={boxVariants}
                      key={movie.id}
                      initial="normal"
                      whileHover="hover"
                      transition={{type:"tween"}}
                      bgPhoto={makeImagePath(movie.backdrop_path,"w500")}
                    >
                    <Info variants={infoVariants} >
                      <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                    
                    )}

              </Row>
            </AnimatePresence>


          </Slider>
        </>
      )}
    </Wrapper>
  )
}

export default Home