import SiteApp from "../site-app";

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SiteApp route={slug} />;
}
