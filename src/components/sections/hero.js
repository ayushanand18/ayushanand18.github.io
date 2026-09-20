import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 560px;
  }

  .hero-meta {
    margin: 20px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-width: 560px;
  }

  .hero-meta span {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--green);
    border: 1px solid var(--green);
    border-radius: var(--border-radius);
    padding: 4px 10px;
  }

  .hero-cta {
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .hero-cta .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 0;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Ayush Anand.</h2>;
  const three = <h3 className="big-heading">Software Engineer @ Zomato.</h3>;
  const four = (
    <>
      <p>
        I build high-throughput backend systems with Go, Kafka, and AWS — vendor payouts at 10K+
        disbursements/day, real-time notification and invoice pipelines, and vision pipelines for
        warehouse SOP checks. Previously at JPMorgan Chase and DB News, GSoC &apos;22 with IOOS. I
        maintain open-source Python packages for ocean data (pyobis, py-dwc-viz).
      </p>
      <div className="hero-meta">
        <span>Go</span>
        <span>Kafka</span>
        <span>AWS</span>
        <span>Postgres / DynamoDB</span>
        <span>Redis</span>
        <span>Docker</span>
      </div>
    </>
  );
  const five = (
    <div className="hero-cta">
      <a className="email-link" href="#projects">
        View My Work
      </a>
      <a
        className="email-link"
        href="https://linkedin.com/in/theayushanand"
        target="_blank"
        rel="noreferrer">
        Connect on LinkedIn
      </a>
    </div>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
