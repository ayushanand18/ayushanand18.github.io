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
    'Python',
    'PyTorch',
    'JavaScript (ES6+)',
    'NodeJS',
    'ReactJS',
    'Firebase',
    'Microsoft Azure',
    'MySQL',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello! My name is Ayush Anand and I enjoy creating things that solve social challenges
              globally. Apart from being a GSoC 2022 student for IOOS, I am a CS Undergrad at NIT
              Durgapur and a Machine Learning Developer leveraging AI for Social Good.
            </p>

            <p>
              <h4>Things I do</h4>
              <ul>
                <li>research on how deep learning can help fight the climate crisis.</li>
                <li>
                  Hacker's Tribe community member - Delhi NCR's largest open source community at
                  Noida.
                </li>
                <li>
                  ISTE NIT Durgapur Students' Branch - Content Writer. I write about Tech, STEM
                </li>
                <li>
                  experiment with CNNs, GANs, ANNs and love playing with their hyperparameters. I am
                  a Udacity deep learning nanodegree graduate.
                </li>
                <li>
                  writing a weekly blog of thoughts into tech, stem, nature and mankind - read me on
                  Medium.
                </li>
              </ul>

              <h4>Projects I'm working on</h4>
              <ul>
                <li>working on an open-source python package for Open Ocean data.</li>
                <li>
                  working with an NGO to implement a code for good project against child abuse.
                </li>
              </ul>

              <h4>Things I did previously</h4>
              <ul>
                <li>built a web-based chatbot that can help reduce unreported abuses.</li>
                <li>
                  built a blockchain powered to tool to track hospital beds and ventilators in
                  COVID19 hospitals.
                </li>
                <li>
                  handled shared responsibility for managing Rotary Sponsored Interact Club programs
                  such as raising awareness against Polio Eradication and Donation drives to local
                  Orphanages in high school.
                </li>
              </ul>
            </p>

            <p>Here are a few technologies I’ve been working with recently:</p>
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
      </div>
    </StyledAboutSection>
  );
};

export default About;
