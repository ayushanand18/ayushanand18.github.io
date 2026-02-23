import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;

      &:after {
        top: 15px;
        left: 15px;
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 20px;
      left: 20px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'Golang',
    'MySQL',
    'C++',
    'Python',
    'JavaScript',
    'TypeScript',
    'FastAPI',
    'Node.js',
    'Next.js',
    'React',
    'Git',
    'RPC',
    'Pandas',
    'CI/CD',
    'Kafka',
    'DynamoDB',
    'Redis',
    'AWS',
    'Cloudflare',
    'Docker',
    'Google Firebase',
    'Linux',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello! My name is Ayush Anand and I enjoy creating things that solve social challenges
              globally. I'm a software developer who loves experimenting with algorithms and software systems,
              currently working at Zomato while contributing to open source projects.
            </p>

            <p>
              <h4>Things I do 💻</h4>
              <ul>
                <li>experiment with algorithms and software systems, love playing with their internals at <a href="https://zomato.com/">Zomato</a>.</li>
                <li>
                  volunteering software engineering time at MBON (Marine Biodiversity Observation Network), working to save animals
                </li>
                <li>
                  writing a weekly blog of thoughts into tech, stem, nature and mankind - read me on <a href="https://medium.com/@theayushanand">Medium</a>
                </li>
                <li>
                  Hacker's Tribe community member - Delhi NCR's largest open source community
                </li>
              </ul>

              <h4>Projects I'm working on 👨‍💻</h4>
              <ul>
                <li>
                  building an http/3 first server library with some crazy features <a href="https://github.com/ayushanand18/crazyhttp">[written in golang]</a>
                </li>
                <li>
                  helping maintain an open-source python package for
                  <a href="https://github.com/iobis/pyobis">Open Ocean Data</a>
                </li>
                <li>
                  helping maintain a Darwin Core Data Visualization
                  <a href="https://github.com/marinebon/py-dwc-viz">python package</a>
                </li>
              </ul>

              <h4>Things I did previously 🔎</h4>
              <ul>
                <li>working at JP Morgan Chase as a Software Engineer, building tools that solve critical business issues.</li>
                <li>worked as a software developer for Crypto News Feed Streaming Platform</li>
                <li>worked as the vice chair of the student society at my campus - ISTE Students' Chapter NIT Durgapur Students Branch.</li>
                <li>created a custom branded ChatGPT alternative for a South American EdTech Company.</li>
                <li>worked at a Web3 AI "deep-tech" startup, developing cutting-edge AI Apps.</li>
                <li>worked on mapping diversity through diversity indices.</li>
                <li>created a AI based conversation booking ecommerce site with an American Fitness Brand.</li>
                <li>built a med-tech app to detect heart disease using eye images.</li>
                <li>built an open-source <a href="https://pypi.org/project/PyEarthData">python package for fetching Earth and Atmospheric data</a> as easily as calling a function.</li>
                <li>worked with a Child Care NGO to implement a code for good project against child abuse, using a web-based chatbot that can help reduce unreported abuses.</li>
                <li>built a blockchain powered tool to track hospital beds and ventilators in COVID19 hospitals.</li>
                <li>ran a Rotary Sponsored Interact Club with programs such as raising awareness against Polio Eradication and Donation drives to local Orphanages in high school.</li>
                <li>built a google assistant chatbot to help detect fake news - got some cool swags from Google for this. I am a Udacity deep learning nanodegree graduate.</li>
              </ul>
            </p>

            <p>Here are a few technologies I've been working with recently:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>

        <div>
          <br />
          <br />
          <h1>Education</h1>
          <div>
            <br />
            <h3>National Institute of Technology Durgapur, India </h3>
            Bachelor of Technology in Computer Science and Engineering
            <i>
              <ul>
                <li>
                  {' '}
                  <b>Courses</b>: Linear and Vector Algebra, Calculus, Data Structure and Algorithms
                </li>
                <li>
                  {' '}
                  <b>Organisations</b>: Indian Society for Technical Education (ISTE)
                </li>
              </ul>
            </i>
          </div>
        </div>
      </div>
    </StyledAboutSection>
  );
};

export default About;
