import React, { useEffect, useRef } from 'react';
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

  .about-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0 40px;
    margin-top: 40px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .about-columns h4,
  .about-previously h4 {
    margin: 0 0 12px;
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;
    color: var(--green);
  }

  ul.about-list {
    padding: 0;
    margin: 0 0 24px;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;

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

  .about-previously {
    margin-top: 16px;
  }

  .about-previously ul.about-list {
    column-count: 2;
    column-gap: 40px;

    @media (max-width: 768px) {
      column-count: 1;
    }

    li {
      break-inside: avoid;
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
    'Python',
    'C++',
    'TypeScript',
    'JavaScript',
    'Postgres',
    'MySQL',
    'React',
    'Redis',
    'gRPC',
    'Node.js',
    'Kafka',
    'AWS',
    'Docker',
    'REST API',
    'CI/CD',
    'Git',
    'Linux',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello! My name is Ayush Anand and I build backend systems that solve real-world
              problems. I work on databases and networks, currently as a Software Engineer at Zomato
              in Bengaluru — vendor payouts at 10K+ disbursements/day, invoice and notification
              pipelines on Go, Kafka, DynamoDB, and Redis, plus vision pipelines for warehouse
              monitoring.
            </p>

            <p>Here are a few technologies I&apos;ve been working with recently:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <img className="img" src="/me.jpg" width={500} alt="Headshot" />
          </div>
        </StyledPic>
      </div>

      <div className="about-columns">
        <div>
          <h4>Things I do 💻</h4>
          <ul className="about-list">
            <li>
              experiment with algorithms and software systems, love playing with their internals at{' '}
              <a href="https://zomato.com/">Zomato</a>.
            </li>
            <li>
              volunteering software engineering time at MBON (Marine Biodiversity Observation
              Network), working to save animals
            </li>
            <li>
              writing a weekly blog of thoughts into tech, stem, nature and mankind - read me on{' '}
              <a href="https://medium.com/@theayushanand">Medium</a>
            </li>
            <li>
              Hacker&apos;s Tribe community member - Delhi NCR&apos;s largest open source community
            </li>
          </ul>
        </div>

        <div>
          <h4>Projects I&apos;m working on 👨‍💻</h4>
          <ul className="about-list">
            <li>
              crazyhttp — async HTTP/3 server library in Go{' '}
              <a href="https://github.com/ayushanand18/crazyhttp">[on GitHub]</a>
            </li>
            <li>
              crazygraphstore — LSM-tree storage engine for graph databases{' '}
              <a href="https://github.com/ayushanand18/crazygraphstore">[on GitHub]</a>
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
        </div>
      </div>

      <div className="about-previously">
        <h4>Things I did previously 🔎</h4>
        <ul className="about-list">
          <li>
            working at JP Morgan Chase as a Software Engineer, building tools that solve critical
            business issues.
          </li>
          <li>worked as a software developer for Crypto News Feed Streaming Platform</li>
          <li>
            worked as the vice chair of the student society at my campus - ISTE Students&apos;
            Chapter NIT Durgapur Students Branch.
          </li>
          <li>created a custom branded ChatGPT alternative for a South American EdTech Company.</li>
          <li>
            worked at a Web3 AI &quot;deep-tech&quot; startup, developing cutting-edge AI Apps.
          </li>
          <li>worked on mapping diversity through diversity indices.</li>
          <li>
            created a AI based conversation booking ecommerce site with an American Fitness Brand.
          </li>
          <li>built a med-tech app to detect heart disease using eye images.</li>
          <li>
            built an open-source{' '}
            <a href="https://pypi.org/project/PyEarthData">
              python package for fetching Earth and Atmospheric data
            </a>{' '}
            as easily as calling a function.
          </li>
          <li>
            worked with a Child Care NGO to implement a code for good project against child abuse,
            using a web-based chatbot that can help reduce unreported abuses.
          </li>
          <li>
            built a blockchain powered tool to track hospital beds and ventilators in COVID19
            hospitals.
          </li>
          <li>
            ran a Rotary Sponsored Interact Club with programs such as raising awareness against
            Polio Eradication and Donation drives to local Orphanages in high school.
          </li>
          <li>
            built a google assistant chatbot to help detect fake news - got some cool swags from
            Google for this. I am a Udacity deep learning nanodegree graduate.
          </li>
        </ul>
      </div>
    </StyledAboutSection>
  );
};

export default About;
