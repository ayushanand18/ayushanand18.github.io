import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledEducationSection = styled.section`
  max-width: 700px;
`;

const Education = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledEducationSection id="education" ref={revealContainer}>
      <h2 className="numbered-heading">Education</h2>

      <div className="inner">
        <h3>National Institute of Technology Durgapur, India</h3>
        <p>Bachelor of Technology in Computer Science and Engineering — GPA: 9.46/10</p>
        <ul>
          <li>
            <b>Courses</b>: Data Structures and Algorithms, Operating Systems, Database Management
            Systems, Computer Networks
          </li>
          <li>
            <b>Organisations</b>: Vice Chairperson, Indian Society for Technical Education (ISTE)
            Students&apos; Chapter
          </li>
        </ul>
      </div>
    </StyledEducationSection>
  );
};

export default Education;
