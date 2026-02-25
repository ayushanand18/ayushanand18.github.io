import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
};

const StyledBlogSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .blog-grid {
    ${({ theme }) => theme.mixins?.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-gap: 20px;
    position: relative;
    margin-top: 50px;
    width: 100%;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const StyledBlogPost = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .post-inner {
        transform: translateY(-5px);
      }
    }
  }

  .post-inner {
    ${({ theme }) => theme.mixins?.boxShadow};
    ${({ theme }) => theme.mixins?.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }

  .post-header {
    margin-bottom: 20px;
  }

  .post-date {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin-bottom: 10px;
  }

  .post-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xl);

    a {
      position: static;
      color: var(--lightest-slate);
      transition: var(--transition);

      &:hover {
        color: var(--green);
      }

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .post-description {
    color: var(--light-slate);
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;

    .tag {
      background-color: var(--light-navy);
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--green);
    }
  }

  .read-more {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin-top: 15px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: var(--transition);

    &:hover {
      gap: 8px;
    }

    &:after {
      content: '→';
    }
  }
`;

const BlogsPage = () => {
  const data = useStaticQuery(graphql`
    query {
      blogs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/blogs/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            frontmatter {
              title
              description
              date
              slug
              tags
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  const revealTitle = useRef(null);
  const revealBlogs = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealBlogs.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const blogs = data.blogs.edges.filter(({ node }) => node);

  const postInner = node => {
    const { frontmatter, fields } = node;
    const { title, description, date, tags } = frontmatter;
    const slug = fields?.slug || frontmatter.slug;

    return (
      <div className="post-inner">
        <header className="post-header">
          <div className="post-date">{formatDate(date)}</div>
          <h3 className="post-title">
            <Link to={`/blogs/${slug}`}>{title}</Link>
          </h3>
        </header>

        <p className="post-description">{description}</p>

        {tags && (
          <div className="post-tags">
            {tags.map((tag, i) => (
              <span key={i} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link to={`/blogs/${slug}`} className="read-more">
          Read more
        </Link>
      </div>
    );
  };

  return (
    <StyledBlogSection>
      <h2 ref={revealTitle}>Blog Posts</h2>

      <ul className="blog-grid">
        {prefersReducedMotion ? (
          <>
            {blogs &&
              blogs.map(({ node }, i) => (
                <StyledBlogPost key={i}>{postInner(node)}</StyledBlogPost>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {blogs &&
              blogs.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={300}
                  exit={false}
                >
                  <StyledBlogPost
                    key={i}
                    ref={el => (revealBlogs.current[i] = el)}
                    style={{
                      transitionDelay: `${i * 100}ms`,
                    }}
                  >
                    {postInner(node)}
                  </StyledBlogPost>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>
    </StyledBlogSection>
  );
};

export default BlogsPage;
