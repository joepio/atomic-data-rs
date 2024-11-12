import { website } from '@/ontologies/website';
import PageFullPage from './PageFullPage';
import BlogIndexPageFullPage from './BlogIndexPageFullPage';
import BlogpostFullPage from './BlogpostFullPage';
import DefaultFullPage from './DefaultFullPage';
import { store } from '@/store';

const FullPageView = async ({
  subject,
  searchParams,
}: {
  subject: string;
  searchParams?: {
    [key: string]: Record<string, string | string[] | undefined>;
  };
}) => {
  const resource = await store.getResource(subject);

  const Component = resource.matchClass(
    {
      [website.classes.page]: PageFullPage,
      [website.classes.blogIndexPage]: BlogIndexPageFullPage,
      [website.classes.blogpost]: BlogpostFullPage,
    },
    DefaultFullPage,
  );

  if (Component === BlogIndexPageFullPage) {
    return <Component resource={resource} searchParams={searchParams} />;
  }

  return <Component resource={resource} />;
};

export default FullPageView;
