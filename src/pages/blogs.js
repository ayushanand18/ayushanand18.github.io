import React, { useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { usePrefersReducedMotion } from '@hooks';

const StyledTableContainer = styled.div`
  margin: 100px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;
        color: var(--green);
        font-family: var(--font-mono);
        font-size: var(--fz-sm);

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-xs);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;

        a {
          color: var(--lightest-slate);
          transition: var(--transition);

          &:hover {
            color: var(--green);
          }
        }

        .description {
          display: block;
          color: var(--slate);
          font-size: var(--fz-sm);
          font-weight: 400;
          margin-top: 5px;
          line-height: 1.4;
        }
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        color: var(--slate);
        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 70px;
        text-align: right;

        a {
          color: var(--green);
          font-family: var(--font-mono);
          font-size: var(--fz-xs);
          transition: var(--transition);

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;

const BlogsPage = ({ location }) => {
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
  const revealTable = useRef(null);
  const revealBlogs = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealBlogs.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, []);

  const blogs = data.blogs.edges.filter(({ node }) => node);

  return (
    <Layout location={location}>
      <Helmet title="Blog" />

      <main>
        <header ref={revealTitle}>
          <h1 className="big-heading">Blog</h1>
          <p className="subtitle">Thoughts on tech, systems, and everything in between</p>
        </header>

        <StyledTableContainer ref={revealTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th className="hide-on-mobile">Tags</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length > 0 &&
                blogs.map(({ node }, i) => {
                  const { frontmatter, fields } = node;
                  const { title, description, date, tags } = frontmatter;
                  const slug = fields?.slug || frontmatter.slug;
                  const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={i} ref={el => (revealBlogs.current[i] = el)}>
                      <td className="year">{formattedDate}</td>

                      <td className="title">
                        <Link to={`/blogs/${slug}`}>{title}</Link>
                        <span className="description hide-on-mobile">{description}</span>
                      </td>

                      <td className="tech hide-on-mobile">
                        {tags?.length > 0 &&
                          tags.map((tag, j) => (
                            <span key={j}>
                              {tag}
                              {j !== tags.length - 1 && <span className="separator">&middot;</span>}
                            </span>
                          ))}
                      </td>

                      <td className="links">
                        <Link to={`/blogs/${slug}`}>Read →</Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </StyledTableContainer>
      </main>
    </Layout>
  );
};

export default BlogsPage;
