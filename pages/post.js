import Link from 'next/link';

import Layout from '../components/Layout'

const Content = (props) => (
  <div>
    <h1>{ props.url.query.title }</h1>
    <p>This is the blog post content.</p>
    <Link href="/">
      <a>Back</a>
    </Link>
  </div>
);

export default (props) => (
  <Layout>
    <Content url={props.url} />
  </Layout>
)