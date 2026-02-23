import React, { useEffect, useRef } from 'react';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components';
import { Layout } from '@components';
import { IconArrowLeft } from '@components/icons';
import { srConfig } from '@config';
import sr from '@utils/sr';

const StyledBlogPost = styled.article`
  max-width: 1000px;
  margin: 0 auto;

  .post-header {
    margin-bottom: 50px;
    text-align: center;

    .post-date {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      margin-bottom: 10px;
    }

    .post-title {
      color: var(--lightest-slate);
      font-size: clamp(26px, 5vw, var(--fz-heading));
      margin: 0 0 20px 0;
      line-height: 1.2;
    }

    .post-description {
      color: var(--slate);
      font-size: var(--fz-lg);
      margin: 0;
      line-height: 1.5;
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-top: 20px;

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
  }

  .post-content {
    margin-bottom: 100px;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--lightest-slate);
      margin: 30px 0 15px 0;

      &:first-of-type {
        margin-top: 0;
      }
    }

    h1 {
      font-size: var(--fz-xxl);
    }

    h2 {
      font-size: var(--fz-xl);
    }

    h3 {
      font-size: var(--fz-lg);
    }

    p {
      color: var(--slate);
      line-height: 1.7;
      margin: 0 0 20px 0;

      a {
        ${({ theme }) => theme.mixins.inlineLink};
      }
    }

    ul,
    ol {
      color: var(--slate);
      margin: 0 0 20px 0;
      padding-left: 30px;

      li {
        margin-bottom: 5px;
      }
    }

    blockquote {
      border-left: 4px solid var(--green);
      padding-left: 20px;
      margin: 30px 0;
      color: var(--slate);
      font-style: italic;
    }

    code {
      background-color: var(--light-navy);
      color: var(--green);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: var(--font-mono);
      font-size: 0.9em;
    }

    pre {
      background-color: var(--light-navy);
      border-radius: var(--border-radius);
      padding: 20px;
      margin: 30px 0;
      overflow-x: auto;

      code {
        background: none;
        padding: 0;
        color: var(--slate);
        font-size: var(--fz-sm);
        line-height: 1.5;
      }
    }

    hr {
      border: none;
      border-top: 1px solid var(--lightest-slate);
      margin: 50px 0;
      opacity: 0.1;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;

      th,
      td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid var(--light-navy);
      }

      th {
        background-color: var(--light-navy);
        color: var(--lightest-slate);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
      }
    }
  }

  .post-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px 0;
    border-top: 1px solid var(--light-navy);

    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      transition: var(--transition);

      &:hover {
        gap: 15px;
      }

      &.prev {
        &:before {
          content: '←';
        }
      }

      &.next {
        &:after {
          content: '→';
        }
      }
    }

    .back-to-blog {
      color: var(--slate);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition);

      &:hover {
        color: var(--green);
        gap: 12px;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const BlogPostTemplate = ({ data, pageContext }) => {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const { title, description, date, tags } = frontmatter;
  const { previous, next } = pageContext;

  const revealContent = useRef(null);

  useEffect(() => {
    sr.reveal(revealContent.current, srConfig());
  }, []);

  return (
    <Layout>
      <StyledBlogPost>
        <header className="post-header">
          <div className="post-date">{date}</div>
          <h1 className="post-title">{title}</h1>
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
        </header>

        <div
          className="post-content"
          ref={revealContent}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <nav className="post-navigation">
          {previous && (
            <Link to={`/blogs/${previous.fields.slug}`} className="nav-link prev">
              {previous.frontmatter.title}
            </Link>
          )}

          <Link to="/blogs" className="back-to-blog">
            <IconArrowLeft />
            Back to Blog
          </Link>

          {next && (
            <Link to={`/blogs/${next.fields.slug}`} className="nav-link next">
              {next.frontmatter.title}
            </Link>
          )}
        </nav>
      </StyledBlogPost>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
        date(formatString: "MMMM DD, YYYY")
        tags
        slug
      }
    }
  }
`;
